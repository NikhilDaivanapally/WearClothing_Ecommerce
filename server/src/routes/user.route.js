const { Router } = require("express");
const {
  getUsers,
  getUsersCount,
  deleteUser,
  changeUserRole,
} = require("../contollers/user.controller");
const { ensureAuthenticatedAdmin } = require("../middleware/auth.middleware");

const router = Router();

router.get("/", ensureAuthenticatedAdmin, getUsers);
router.get("/count", ensureAuthenticatedAdmin, getUsersCount);
router.delete("/:id", ensureAuthenticatedAdmin, deleteUser);
router.put("/changerole", ensureAuthenticatedAdmin, changeUserRole);

module.exports = router;
