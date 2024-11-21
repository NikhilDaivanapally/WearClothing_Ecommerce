const Category = require("./category.model");
const Product = require("./product.model");
const Cart = require("./cart.model");
const CartItem = require("./cartItem.model");
const User = require("./user.model");
const OrderItem = require("./OrderItem.model");
const Order = require("./order.model");
const Wishlist = require("./wishlist.model");
const WishlistItem = require("./wishlistItem.model");

function initializeAssociations() {
  // Category Associations
  Category.hasMany(Product, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  Category.belongsTo(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });

  // Product Associations
  Product.belongsTo(Category, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  Product.belongsTo(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  Product.belongsToMany(Cart, { through: CartItem, onDelete: "CASCADE" });
  Product.belongsToMany(Order, { through: OrderItem, onDelete: "CASCADE" });
  Product.belongsToMany(Wishlist, {
    through: WishlistItem,
    onDelete: "CASCADE",
  });

  // User Associations
  User.hasMany(Product, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  User.hasMany(Category, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  User.hasOne(Cart, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  User.hasOne(Wishlist, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  User.hasMany(Order, { onDelete: "CASCADE", onUpdate: "CASCADE" });

  // Wishlist Associations
  Wishlist.belongsTo(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  Wishlist.belongsToMany(Product, {
    through: WishlistItem,
    onDelete: "CASCADE",
  });

  // Cart Associations
  Cart.belongsTo(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  Cart.belongsToMany(Product, { through: CartItem, onDelete: "CASCADE" });

  // Order Associations
  Order.belongsTo(User, { onDelete: "CASCADE", onUpdate: "CASCADE" });
  Order.belongsToMany(Product, { through: OrderItem, onDelete: "CASCADE" });
}

module.exports = initializeAssociations;
