const { Op, Sequelize } = require("sequelize");
const Category = require("../models/category.model");
const Product = require("../models/product.model");
const { ApiResponse } = require("../utils/ApiResponse");
const { uploadCloudinary } = require("../utils/cloudinary");

const getAdminProductsAndCount = async (req, res) => {
  try {
    const page = req.query.page ? req.query.page : 1;
    const sort = req.query.sort ? req.query.sort : "createdAt";
    const order = req.query.order
      ? req.query.order.toUpperCase()
      : "desc".toUpperCase();
    const productsPerPage = 8;
    const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;
    const brandsArray = req.query.brands ? req.query.brands.split(",") : null;
    const priceCondition = {};

    // Convert query params to floats, ensure correct precision for decimal
    if (minPrice !== undefined && minPrice !== null) {
      priceCondition["min"] = minPrice.toFixed(2);
    }
    if (maxPrice !== undefined && maxPrice !== null) {
      priceCondition["max"] = maxPrice.toFixed(2);
    }

    const price = Object.values(priceCondition).length > 0 && {
      [Op.between]: [priceCondition.min, priceCondition.max],
    };

    const brandsconition = brandsArray &&
      brandsArray?.length && { [Op.in]: brandsArray };

    const whereCondition = {};

    if (Object.values(priceCondition).length) {
      whereCondition["price"] = price;
    }

    if (brandsArray && brandsArray.length) {
      whereCondition["brand"] = brandsconition;
    }

    const products = await Product.findAll({
      where: { ...whereCondition },
      include: [
        {
          model: Category,
          as: "category", // Matches the alias in the relationship
          attributes: ["id", "name"], // Specify fields from Category
          include: [
            {
              model: Category,
              as: "parent", // Self-referencing include for the parent category
              attributes: ["id", "name"],
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
      order: [[sort, order]],
      limit: productsPerPage,
      offset: (page - 1) * productsPerPage,
      raw: true,
    });
    const ArrayofProductvalues = Object.values(products).map((product) => {
      return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        images: product.images,
        price: product.price,
        sizes: product.sizes,
        path: `/${product["category.parent.parent.name"].toLowerCase()}/${product["category.name"].toLowerCase()}/${product.id}`,
      };
    });
    const productsCount = await Product.count({
      where: { ...whereCondition },
    });

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { products: ArrayofProductvalues, productsCount },
          "Products and ProductsCount fetched Successfully"
        )
      );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getProducts = async (req, res) => {
  const { id } = req.query;
  const includeProducts = req.query.includeProducts
    ? req.query.includeProducts
    : true;
  const includeCount = req.query.includeCount ? req.query.includeCount : true;
  const page = req.query.page ? req.query.page : 1;
  const sort = req.query.sort ? req.query.sort : "createdAt";
  const order = req.query.order
    ? req.query.order.toUpperCase()
    : "desc".toUpperCase();
  const productsPerPage = 8;
  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;
  const brandsArray = req.query.brands ? req.query.brands.split(",") : null;
  const priceCondition = {};

  // Convert query params to floats, ensure correct precision for decimal
  if (minPrice !== undefined && minPrice !== null) {
    priceCondition["min"] = minPrice.toFixed(2);
  }
  if (maxPrice !== undefined && maxPrice !== null) {
    priceCondition["max"] = maxPrice.toFixed(2);
  }

  const price = Object.values(priceCondition).length > 0 && {
    [Op.between]: [priceCondition.min, priceCondition.max],
  };

  const brandsconition = brandsArray &&
    brandsArray?.length && { [Op.in]: brandsArray };

  const whereCondition = {};
  whereCondition["categoryId"] = id;

  if (Object.values(priceCondition).length) {
    whereCondition["price"] = price;
  }

  if (brandsArray && brandsArray.length) {
    whereCondition["brand"] = brandsconition;
  }

  const data = {};
  if (includeProducts) {
    const products = await Product.findAll({
      where: { ...whereCondition },
      include: [
        {
          model: Category,
          as: "category", // Matches the alias in the relationship
          attributes: ["id", "name"], // Specify fields from Category
          include: [
            {
              model: Category,
              as: "parent", // Self-referencing include for the parent category
              attributes: ["id", "name"],
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
      order: [[sort, order]],
      limit: productsPerPage,
      offset: (page - 1) * productsPerPage,
      raw: true,
    });
    const ArrayofProductvalues = Object.values(products).map((product) => {
      return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        images: product.images,
        price: product.price,
        sizes: product.sizes,
        path: `/${product["category.parent.parent.name"].toLowerCase()}/${product["category.name"].toLowerCase()}/${product.id}`,
      };
    });

    data["products"] = ArrayofProductvalues;
  }
  if (includeCount) {
    const products = await Product.count({
      where: whereCondition,
    });
    data["productsCount"] = products;
  }
  res.status(200).json(new ApiResponse(200, data, "data fetched Successfully"));
};

const getProductsMetadata = async (req, res) => {
  const { id } = req.query;
  const brands = await Product.findAll({
    where: { categoryId: id },
    attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("brand")), "brand"]],
    raw: true,
  });

  // Extract the 'brand' field values from the result
  const brandArray = brands.map((product) => product.brand);

  const priceRange = await Product.findAll({
    where: { categoryId: id },
    attributes: [
      [Sequelize.fn("MIN", Sequelize.col("price")), "minPrice"], // Get minimum price
      [Sequelize.fn("MAX", Sequelize.col("price")), "maxPrice"], // Get maximum price
    ],
  });

  const minMaxPriceArray = {
    minPrice: priceRange[0].dataValues.minPrice,
    maxPrice: priceRange[0].dataValues.maxPrice,
  };

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { brands: brandArray, priceRange: minMaxPriceArray },
        "brands fetched Successfully"
      )
    );
};

const getProductById = async (req, res) => {
  const id = req.params.id;
  const product = await Product.findByPk(id);

  res
    .status(200)
    .json(new ApiResponse(200, product, "product fetched Successfully"));
};

const createProduct = async (req, res) => {
  try {
    const {
      Brand,
      name,
      price,
      material,
      size,
      fit,
      washcare,
      sizes,
      categoryId,
    } = req.body;
    const parsedSizes = JSON.parse(sizes);

    let imgUrls = [];
    if (req.files && req.files.length > 0) {
      // Upload images to Cloudinary and get their URLs
      const uploadPromises = req.files.map((img) => uploadCloudinary(img.path));
      const uploadimages = await Promise.all(uploadPromises);
      imgUrls = uploadimages.map((image) => image.secure_url);
    }

    const data = {
      brand: Brand,
      name,
      price,
      material,
      size,
      fit,
      washcare,
      categoryId,
      sizes: parsedSizes,
      images: imgUrls, // Include the uploaded image URLs in the output
    };
    // Add logic to save the product to your database here...
    const product = await Product.create(data);
    res.status(201).json({ message: "product added successfully", product });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add product", error: error.message });
  }
};

const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const updateData = req.body;
  let imgUrls = [];
  if (req.files && req.files.length > 0) {
    // Upload images to Cloudinary and get their URLs
    const uploadPromises = req.files.map((img) => uploadCloudinary(img.path));
    const uploadimages = await Promise.all(uploadPromises);
    imgUrls = uploadimages.map((image) => image.secure_url);
  }

  try {
    const product = await Product.findByPk(productId);
    if (product) {
      Object.keys(updateData).map((key) => {
        if (key == "images") {
          product[key] = [...updateData[key], ...imgUrls];
        } else if (imgUrls.length) {
          product["images"] = [...product["images"], ...imgUrls];
        } else {
          product[key] = JSON.parse(updateData[key]);
        }
      });
    }
    await product.save();
    res
      .status(200)
      .json(new ApiResponse(200, product, "product updated Successfully"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const deleteProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    await Product.destroy({ where: { id: productId } });
    res
      .status(200)
      .json(new ApiResponse(200, {}, "Product deleted Successfully"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSearchProducts = async (req, res) => {
  const { q } = req.query;
  const page = req.query.page ? req.query.page : 1;
  const sort = req.query.sort ? req.query.sort : "createdAt";
  const order = req.query.order
    ? req.query.order.toUpperCase()
    : "desc".toUpperCase();
  const productsPerPage = 8;

  const minPrice = req.query.minPrice ? Number(req.query.minPrice) : null;
  const maxPrice = req.query.maxPrice ? Number(req.query.maxPrice) : null;
  const brandsArray = req.query.brands ? req.query.brands.split(",") : null;
  const priceCondition = {};

  // Convert query params to floats, ensure correct precision for decimal
  if (minPrice !== undefined && minPrice !== null) {
    priceCondition["min"] = minPrice.toFixed(2);
  }
  if (maxPrice !== undefined && maxPrice !== null) {
    priceCondition["max"] = maxPrice.toFixed(2);
  }

  const price = Object.values(priceCondition).length > 0 && {
    [Op.between]: [priceCondition.min, priceCondition.max],
  };

  const brandsconition = brandsArray &&
    brandsArray?.length && { [Op.in]: brandsArray };

  const whereCondition = {};

  if (Object.values(priceCondition).length) {
    whereCondition["price"] = price;
  }

  if (brandsArray && brandsArray.length) {
    whereCondition["brand"] = brandsconition;
  }

  const products = await Product.findAll({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.iLike]: `%${q}%`,
          },
        },
        {
          brand: {
            [Op.iLike]: `%${q}%`,
          },
        },
      ],
      ...whereCondition,
    },
    include: [
      {
        model: Category,
        as: "category", // Matches the alias in the relationship
        attributes: ["id", "name"], // Specify fields from Category
        include: [
          {
            model: Category,
            as: "parent", // Self-referencing include for the parent category
            attributes: ["id", "name"],
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
    order: [[sort, order]],
    limit: productsPerPage,
    offset: (page - 1) * productsPerPage,
    raw: true,
  });
  const ArrayofProductvalues = Object.values(products).map((product) => {
    return {
      id: product.id,
      name: product.name,
      brand: product.brand,
      images: product.images,
      price: product.price,
      sizes: product.sizes,
      path: `/${product["category.parent.parent.name"].toLowerCase()}/${product["category.name"].toLowerCase()}/${product.id}`,
    };
  });

  const productsCount = await Product.count({
    where: {
      [Op.or]: [
        {
          name: {
            [Op.iLike]: `%${q}%`,
          },
        },
        {
          brand: {
            [Op.iLike]: `%${q}%`,
          },
        },
      ],
      ...whereCondition,
    },
  });
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { products: ArrayofProductvalues, productsCount },
        "data fetched Successfully"
      )
    );
};

const getSearchProductsMetadata = async (req, res) => {
  try {
    const { q } = req.query; // Get the query string parameter

    if (!q) {
      return res.status(400).json({ message: "Search query is required" });
    }

    // Search in both 'name' and 'brand' fields using Sequelize's Op.or and Op.like
    const brands = await Product.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${q}%`,
            },
          },
          {
            brand: {
              [Op.iLike]: `%${q}%`,
            },
          },
        ],
      },
    });

    const brandArray = brands.reduce((acc, product) => {
      if (!acc.includes(product.brand)) {
        acc.push(product.brand);
      }
      return acc; // Return the accumulator
    }, []);

    const priceRange = await Product.findAll({
      where: {
        [Op.or]: [
          {
            name: {
              [Op.iLike]: `%${q}%`,
            },
          },
          {
            brand: {
              [Op.iLike]: `%${q}%`,
            },
          },
        ],
      },
      attributes: [
        [Sequelize.fn("MIN", Sequelize.col("price")), "minPrice"], // Get minimum price
        [Sequelize.fn("MAX", Sequelize.col("price")), "maxPrice"], // Get maximum price
      ],
    });

    const minMaxPriceArray = {
      minPrice: priceRange[0].dataValues.minPrice,
      maxPrice: priceRange[0].dataValues.maxPrice,
    };
    // Return the list of products
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { brands: brandArray, priceRange: minMaxPriceArray },
          "brands & pricerange fetched Successfully"
        )
      );
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAdminBrandsAndPriceRange = async (req, res) => {
  try {
    const brands = await Product.findAll({
      attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("brand")), "brand"]],
      raw: true,
    });

    // Extract the 'brand' field values from the result
    const brandArray = brands.map((product) => product.brand);

    const priceRange = await Product.findAll({
      attributes: [
        [Sequelize.fn("MIN", Sequelize.col("price")), "minPrice"], // Get minimum price
        [Sequelize.fn("MAX", Sequelize.col("price")), "maxPrice"], // Get maximum price
      ],
    });

    const minMaxPriceArray = {
      minPrice: priceRange[0].dataValues.minPrice,
      maxPrice: priceRange[0].dataValues.maxPrice,
    };

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { brands: brandArray, priceRange: minMaxPriceArray },
          "brands fetched Successfully"
        )
      );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const NewArrivals = async (req, res) => {
  const { ids } = req.query;
  const categoryIds = ids.split(",");
  const page = 1;
  const sort = "createdAt";
  const order = "DESC";
  try {
    const data = await Product.findAll({
      where: {
        categoryId: {
          [Op.in]: categoryIds,
        },
      },
      attributes: ["id", "brand", "name", "price", "images"],
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
      order: [[sort, order]],
      limit: 15,
      offset: (page - 1) * 5,
      raw: true,
    });

    // Flatten the data to avoid deep nesting for the frontend
    const flattenedProducts = data.map((product) => {
      return {
        id: product.id,
        name: product.name,
        brand: product.brand,
        images: product.images,
        price: product.price,
        sizes: product.sizes,
        path: `/${product["category.parent.parent.name"].toLowerCase()}/${product["category.name"].toLowerCase()}/${product.id}`,
      };
    });
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          flattenedProducts,
          "NewArrivals fetched Successfully"
        )
      );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const TotalProductsCount = async (req, res) => {
  try {
    const productsCount = await Product.count();
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          productsCount,
          "Total Products Count fetched Successfully"
        )
      );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  NewArrivals,
  TotalProductsCount,

  getProducts,
  getProductsMetadata,
  getProductById,

  getSearchProducts,
  getSearchProductsMetadata,

  getAdminProductsAndCount,
  getAdminBrandsAndPriceRange,
};
