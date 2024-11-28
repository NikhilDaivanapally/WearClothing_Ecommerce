const Cart = require("../models/cart.model");
const CartItem = require("../models/cartItem.model");
const Product = require("../models/product.model");
const { ApiResponse } = require("../utils/ApiResponse");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: { UserId: req.user?.id },
      attributes: { exclude: ["createdAt", "updatedAt", "UserId"] }, // Exclude fields from Cart
      include: [
        {
          model: Product,
          attributes: {
            exclude: [
              "createdAt",
              "updatedAt",
              "fit",
              "size",
              "material",
              "washcare",
              "UserId",
              "categoryId",
            ],
          }, // Exclude fields from Product
          through: {
            model: CartItem,
            attributes: {
              exclude: ["createdAt", "updatedAt", "cartId", "productId"],
            }, // Exclude fields from CartItem
          },
        },
      ],
    });
    if (!cart) {
      res.status(404).json(new ApiResponse(404, {}, "Cart Not Found"));
    } else {
      res
        .status(200)
        .json(new ApiResponse(200, cart, "Cart Found Successfully"));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  const { id: productId, size, cartId } = req.body;
  try {
    if (productId && size && cartId) {
      await CartItem.create({ productId, size, cartId });
      res
        .status(200)
        .json(new ApiResponse(200, {}, "Product is Added to Cart"));
    } else {
      res.status(500).json({ error: "Parameters Not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  const id = req.params.id;
  const { cartId } = req.body;
  try {
    if (id && cartId) {
      const cartitem = await CartItem.findOne({
        where: {
          id,
          cartId,
        },
      });
      if (cartitem) {
        await CartItem.destroy({
          where: {
            id,
            cartId,
          },
        });
        res
          .status(200)
          .json(new ApiResponse(200, {}, "Product is Removed from Cart"));
      } else {
        res.status(500).json({ error: "cartItem Not found" });
      }
    } else {
      res.status(500).json({ error: "Parameters Not Found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCart = async (req, res) => {
  const cartItemId = req.params.id;
  const { size, quantity } = req.body;
  try {
    if (cartItemId && (size || quantity)) {
      const updatecartItem = await CartItem.findByPk(cartItemId);
      if (updatecartItem) {
        if (size) {
          updatecartItem.size = size;
          await updatecartItem.save();
        } else if (quantity) {
          updatecartItem.quantity = quantity;
          await updatecartItem.save();
        }
        res
          .status(200)
          .json({ message: "cartItem Updated Successfull", updatecartItem });
      } else {
        res.status(500).json({ error: "CartItem Not found" });
      }
    } else {
      res.status(500).json({ error: "Parameters Not Found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "undable to update cartItem", error: error.message });
  }
};

module.exports = { getCart, addToCart, removeFromCart, updateCart };
