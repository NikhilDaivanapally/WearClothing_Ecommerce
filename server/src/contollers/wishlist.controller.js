const Category = require("../models/category.model");
const Product = require("../models/product.model");
const Wishlist = require("../models/wishlist.model");
const WishlistItem = require("../models/wishlistItem.model");
const { ApiResponse } = require("../utils/ApiResponse");

const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({
      where: { UserId: req.user?.id },
      include: [
        {
          model: Product,
          include: [
            {
              model: Category, // Assuming Category is associated with Product
              required: false, // Optional: Only include if there’s a matching Category
            },
          ],
          through: { model: WishlistItem }, // Define the through model here
        },
      ],
    });

    if (!wishlist) {
      res.status(404).json(new ApiResponse(200, {}, "wishlist not found"));
    } else {
      res
        .status(200)
        .json(new ApiResponse(200, wishlist, "wishlist found successfully"));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToWishlist = async (req, res) => {
  const { id: productId, wishlistId } = req.body;
  try {
    if (productId && wishlistId) {
      await WishlistItem.create({
        productId,
        wishlistId,
      });
      res
        .status(200)
        .json(new ApiResponse(200, {}, "Product is Added to Wishlist"));
    } else {
      res.status(500).json({ error: "Parameters Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  const id = req.params.id;
  const { wishlistId } = req.body;
  try {
    if (id && wishlistId) {
      // find the wishlistItem
      const wishlistitem = await WishlistItem.findOne({
        where: {
          productId: id,
          wishlistId,
        },
      });
      if (wishlistitem) {
        await WishlistItem.destroy({
          where: {
            productId: id,
            wishlistId,
          },
        });
        res
          .status(200)
          .json(new ApiResponse(200, {}, "Product is Removed from Wishlist"));
      } else {
        res.status(500).json({ error: "wishlistItem Not found" });
      }
    } else {
      res.status(500).json({ error: "Parameters Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getWishlist, removeFromWishlist, addToWishlist };
