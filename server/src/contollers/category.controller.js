const Category = require("../models/category.model");
const Product = require("../models/product.model");
const { ApiResponse } = require("../utils/ApiResponse");

const getCategories = async (req, res) => {
  try {
    const fetchedCategories = await Category.findAll({
      where: { parentId: null },
      attributes: ["id", "name"],
      include: [
        {
          model: Category,
          as: "subcategories",
          attributes: ["id", "name"],
          include: [
            {
              model: Category,
              as: "subcategories",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
      raw: false, // Ensure we get Sequelize instances initially
      nest: true, // Nest results for easier handling of relationships
    });

    // Convert to plain objects to remove circular references
    const plainCategories = JSON.parse(JSON.stringify(fetchedCategories));

    // Define the desired order
    const categoryOrder = ["Mens", "Womens", "Kids"];
    const subcategoryOrder = ["TopWear", "BottomWear", "FestivalWear"];

    // Function to sort based on the order array
    const sortByOrder = (array, order) =>
      array.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name));

    // Sort categories and their subcategories
    const sortedCategories = sortByOrder(plainCategories, categoryOrder).map(
      (category) => {
        return {
          ...category,
          subcategories: sortByOrder(category.subcategories, subcategoryOrder),
        };
      }
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          sortedCategories,
          "Categories fetched Successfully"
        )
      );
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const createCategory = async (req, res) => {
  const { name, parentId } = req.body;
  try {
    const newcategory = await Category.create({
      name,
      parentId,
    });
    res
      .status(200)
      .json(new ApiResponse(200, newcategory, "Category created Successfully"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteCategory = async (req, res) => {
  const id = req.params.id;
  try {
    // First, delete the records where this id is a parentId
    await Category.destroy({
      where: {
        parentId: id,
      },
    });

    // Then, delete the record where this id is the primary key (id)
    const deleted = await Category.destroy({
      where: {
        id,
      },
    });

    if (deleted) {
      res
        .status(200)
        .json(
          new ApiResponse(
            200,
            {},
            "Category deleted successfully and subcategories which have parentId as the  to category id is also deleted successfully"
          )
        );
    } else {
      res.status(404).json({ message: "Category not found." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCategory = async (req, res) => {
  const id = req.params.id;
  const { name } = req.body;

  try {
    if (id && name) {
      const category = await Category.findByPk(id);
      if (category) {
        category.name = name;
        await category.save();

        res
          .status(200)
          .json(
            new ApiResponse(200, category, "Category Updated Successfully")
          );
      } else {
        res.status(404).json(new ApiResponse(404, {}, "user not found"));
      }
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubcategories = async (req, res) => {
  try {
    let ArrayOfIds = req.query.data;
    ArrayOfIds = ArrayOfIds.split(",");
    // Map and resolve all promises in parallel using Promise.all
    const subcategories = await Promise.all(
      ArrayOfIds.map((id) =>
        Product.findOne({
          where: {
            categoryId: id,
          },
          attributes: ["id", "images"],
          include: [
            {
              model: Category,
              as: "category", // Matches the alias in the relationship
              attributes: ["id", "name"], // Specify fields from Category
              include: [
                {
                  model: Category,
                  as: "parent", // Self-referencing include for the parent category
                  attributes: ["id", "name"], // Fields to retrieve from the parent category
                  include: [
                    {
                      model: Category,
                      as: "parent", // Self-referencing include for the parent category
                      attributes: ["id", "name"],
                    },
                  ],
                },
              ],
            },
          ],
        })
      )
    );

    // // Flatten the data to avoid deep nesting for the frontend
    const flattenedProducts = subcategories.map((product) => {
      if (product) {
        return {
          image: product?.images[0],
          CategoryName: product?.category?.name?.toLowerCase(),
          path: `/${product?.category?.parent?.parent?.name?.toLowerCase()}/${product?.category?.parent?.name?.toLowerCase()}/${product?.category?.name?.toLowerCase()}`,
        };
      }
    }); // The array of resolved subcategory data
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          flattenedProducts,
          "SubCategories fetched Successfully"
        )
      ); // Send the resolved data as response
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while fetching subcategories." });
  }
};

module.exports = {
  getCategories,
  createCategory,
  deleteCategory,
  updateCategory,
  getSubcategories,
};
