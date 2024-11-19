const express = require("express");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const cors = require("cors");
const passport = require("./utils/passport.localStrategy");
const app = express();
const authRoutes = require("../src/routes/auth.route");
const productRoutes = require("../src/routes/products.route");
const wishlistRoutes = require("../src/routes/wishlist.route");
const cartRoutes = require("../src/routes/cart.route");
const categoryRoutes = require("../src/routes/category.route");
const userRouter = require("../src/routes/user.route");
const Category = require("./models/category.model");
const Product = require("./models/product.model");
const Cart = require("./models/cart.model");
const CartItem = require("./models/cartItem.model");
const User = require("./models/user.model");
const OrderItem = require("./models/OrderItem.model");
const Order = require("./models/order.model");
const Wishlist = require("./models/wishlist.model");
const WishlistItem = require("./models/wishlistItem.model");
const cookieParser = require("cookie-parser");
const sequelize = require("./db/connectToMysql");

// Create the session store
const sessionStore = new SequelizeStore({
  db: sequelize,
});

// Sync the session table
sessionStore.sync();

app.use(
  cors({
    origin: [
      "https://ecommerce-kappa-seven-47.vercel.app",
      "https://ecommerce-nikhil-daivanapallys-projects.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: "your-secret-key", // Replace with your secret key
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      // secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "none", // Required for cross-origin requests
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Your Backend seems to be working fine 👍" });
});

// auth Routes
app.use("/api/v1/auth", authRoutes);

// product Routes
app.use("/api/v1/products", productRoutes);

// category Routes
app.use("/api/v1/categories", categoryRoutes);

//user Routes
app.use("/api/v1/users", userRouter);

// cart Routes
app.use("/api/v1/cart", cartRoutes);

//wishlist Routes
app.use("/api/v1/wishlist", wishlistRoutes);

Category.hasMany(Product);
Category.belongsTo(User);

Product.belongsTo(Category);
Product.belongsTo(User);
Product.belongsToMany(Cart, { through: CartItem });
Product.belongsToMany(Order, { through: OrderItem });
Product.belongsToMany(Wishlist, { through: WishlistItem });

User.hasMany(Product);
User.hasMany(Category);
User.hasOne(Cart);
User.hasOne(Wishlist);
User.hasMany(Order);

Wishlist.belongsTo(User);
Wishlist.belongsToMany(Product, { through: WishlistItem });
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });

Order.belongsTo(User);
Order.belongsToMany(Product, { through: OrderItem });

module.exports = app;
