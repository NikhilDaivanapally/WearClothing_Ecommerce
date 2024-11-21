const express = require("express");
const session = require("express-session");
const cors = require("cors");
const passport = require("./utils/passport.localStrategy");
const cookieParser = require("cookie-parser");
const RedisStore = require("connect-redis").default;
const redisClient = require("./db/redis");

// Routes
const authRoutes = require("../src/routes/auth.route");
const productRoutes = require("../src/routes/products.route");
const wishlistRoutes = require("../src/routes/wishlist.route");
const cartRoutes = require("../src/routes/cart.route");
const categoryRoutes = require("../src/routes/category.route");
const userRouter = require("../src/routes/user.route");

// Models
const initializeAssociations = require("./models/associations");

const app = express();

// Set environment-based CORS origins
const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://wearclothings.vercel.app"]
    : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Initialize session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default-secret",
    store: new RedisStore({ client: redisClient, ttl: 24 * 60 * 60 }),
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate("session"));
app.set("trust proxy", true);

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/wishlist", wishlistRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.status(200).json({ message: "Your Backend seems to be working fine 👍" });
});

// Initialize Sequelize associations
initializeAssociations();

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = app;
