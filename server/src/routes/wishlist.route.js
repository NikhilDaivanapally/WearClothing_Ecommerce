const { Router } = require("express");
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../contollers/wishlist.controller");
const { ensureAuthenticated } = require("../middleware/auth.middleware");

const router = Router();

router.get("/", ensureAuthenticated, getWishlist);
router.post("/", ensureAuthenticated, addToWishlist);
router.delete("/:id", ensureAuthenticated, removeFromWishlist);

module.exports = router;
