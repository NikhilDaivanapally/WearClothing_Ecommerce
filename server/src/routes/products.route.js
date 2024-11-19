const { Router } = require("express");
const {
  getProducts,
  getProductsMetadata,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getSearchProducts,
  getSearchProductsMetadata,
  getAdminProductsAndCount,
  getAdminBrandsAndPriceRange,
  NewArrivals,
  TotalProductsCount,
} = require("../contollers/product.controller");
const { upload } = require("../middleware/multer.middleware");
const { ensureAuthenticatedAdmin } = require("../middleware/auth.middleware");

const router = Router();
// products
router.get("/", getProducts);
router.get("/metadata", getProductsMetadata);

// search Products
router.get("/search", getSearchProducts);
router.get("/search/metadata", getSearchProductsMetadata);

router.get("/admin", ensureAuthenticatedAdmin, getAdminProductsAndCount);
router.get(
  "/admin/metadata",
  ensureAuthenticatedAdmin,
  getAdminBrandsAndPriceRange
);

router.get("/newArrivals", NewArrivals);
router.post(
  "/",
  ensureAuthenticatedAdmin,
  upload.array("images"),
  createProduct
); // Create a new product
router.get("/totalProductsCount", ensureAuthenticatedAdmin, TotalProductsCount);

router.get("/:id", getProductById); // Get product by ID
router.put(
  "/:id",
  ensureAuthenticatedAdmin,
  upload.array("updateimages"),
  updateProduct
); // Update product by ID
router.delete("/:id", ensureAuthenticatedAdmin, deleteProduct); // Delete product by ID
module.exports = router;
