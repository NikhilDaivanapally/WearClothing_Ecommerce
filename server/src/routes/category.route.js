const { Router } = require("express");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getCategories,
  getSubcategories,
} = require("../contollers/category.controller");
const { ensureAuthenticatedAdmin } = require("../middleware/auth.middleware");
const router = Router();
router.get("/", getCategories);
router.get("/subcategories", getSubcategories);
router.post("/", ensureAuthenticatedAdmin, createCategory);
router.put("/:id", ensureAuthenticatedAdmin, updateCategory);
router.delete("/:id", ensureAuthenticatedAdmin, deleteCategory);

module.exports = router;
