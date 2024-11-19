const { Router } = require("express");
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} = require("../contollers/cart.controller");

const router = Router();

router.get("/", ensureAuthenticated, getCart);
router.post("/", ensureAuthenticated, addToCart);
router.put("/:id", ensureAuthenticated, updateCart);
router.delete("/:id", ensureAuthenticated, removeFromCart);

module.exports = router;
