const { Router } = require("express");
const passport = require("passport");
const { ensureAuthenticated } = require("../middleware/auth.middleware");
const {
  registerUser,
  loginUser,
  logoutUser,
  forgotpassword,
  resetpassword,
  loginFailed,
  loginSuccess,
  googleLogin,
} = require("../contollers/auth.controller");

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", ensureAuthenticated, logoutUser);
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get("/google/callback", googleLogin);
router.get("/login/success", ensureAuthenticated, loginSuccess);
router.get("/login/failed", loginFailed);
router.post("/forgot-password", forgotpassword);
router.post("/reset-password", resetpassword);

module.exports = router;
