const { Op } = require("sequelize");
const Cart = require("../models/cart.model");
const User = require("../models/user.model");
const Wishlist = require("../models/wishlist.model");
const sendMail = require("../services/mailer");
const ResetPassword = require("../Templates/Mail/resetPassword");
const crypto = require("crypto");
const { v2: cloudinary } = require("cloudinary");
const { ApiResponse } = require("../utils/ApiResponse");
const passport = require("passport");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const registerUser = async (req, res, next) => {
  try {
    const { email, username, phonenumber, password } = req.body;
    const role = email === process.env.ADMIN ? "Admin" : "user";

    const profile = await cloudinary.uploader.upload(
      `https://avatar.iran.liara.run/username?username=${username}`,
      {
        resource_type: "auto",
      }
    );

    const user = await User.create({
      email,
      username,
      phonenumber,
      password,
      role,
      profileimage: profile.url,
    });

    //checked wether the wishlist and cart has been created
    let cart = await Cart.findOne({
      where: { UserId: user.id },
    });
    if (!cart) {
      cart = await Cart.create({ UserId: user.id });
    }

    let wishlist = await Wishlist.findOne({
      where: { UserId: user.id },
    });

    if (!wishlist) {
      wishlist = await Wishlist.create({ UserId: user.id });
    }

    res
      .status(201)
      .json(new ApiResponse(200, user, "User Registered successfully"));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(err); // Pass errors to the error handler
    }

    if (!user) {
      return res.status(401).json({
        message: "Username or password is incorrect",
      });
    }

    req.login(user, (err) => {
      if (err) {
        return next(err); // Handle error during the login process
      }
      res
        .status(200)
        .json(new ApiResponse(200, user, "Logged in successfully"));
    });
  })(req, res, next); // Pass req, res, and next to the authenticate function
};

const logoutUser = async (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }

    // Destroy the session from Redis
    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        console.error("Error destroying session:", sessionErr);
        return res
          .status(500)
          .json(new ApiResponse(500, {}, "Failed to log out"));
      }

      // Clear the connect.sid cookie
      res.clearCookie("connect.sid", {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });

      return res
        .status(200)
        .json(new ApiResponse(200, {}, "Logout successful"));
    });
  });
};


const loginSuccess = async (req, res) => {
  const user = req.user;

  if (user) {
    let cart = await Cart.findOne({
      where: { UserId: user.id },
    });

    let wishlist = await Wishlist.findOne({
      where: { UserId: user.id },
    });

    res.status(200).json({
      success: true,
      message: "successfull",
      data: { user: req.user, cartId: cart.id, wishlistId: wishlist.id },
    });
  }
};

const loginFailed = (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
};

const forgotpassword = async (req, res) => {
  // get users email
  const { email } = req.body;
  const isvalidemailformat = email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
  if (!isvalidemailformat) {
    return res.status(500).json({
      message: "Invalid email address",
    });
  }
  const user = await User.findOne({
    where: {
      email: email,
    },
  });

  if (!user) {
    // res No User found with this Email
    return res.status(404).json({
      message: "User does not exists with the provided Email",
    });
  }
  try {
    const resetToken = await user.createPasswordResetToken();
    const resetURL = `https://wearclothings.vercel.app/account/reset-password?token=${resetToken}`;
    // send the resetURL to the email
    await sendMail({
      to: user.email,
      subject: "Password Reset 🔑",
      html: ResetPassword(user.username, resetURL),
      attachments: [],
    });
    // res Reset Password Link sent to Email
    res
      .status(200)
      .json(
        new ApiResponse(200, resetToken, "Password Reset URL is sent to email!")
      );
  } catch (error) {
    // Set fields to undefined
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    // Save without running validations
    await user.save({ validate: false });
    // res Error occured While Sending the Email
    res.status(500).json({
      message: error.message,
    });
  }
};

// resetpassword
const resetpassword = async (req, res, next) => {
  // Get the token from the url using query
  const { token } = req.query;
  const { NewPassword, confirmNewPassword } = req.body;
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    // find the user who has this hashedToken
    const user = await User.findOne({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { [Op.gt]: Date.now() },
      },
    });
    // If token expires or submission is out of Time
    if (!user) {
      // res Token is Invalid or Expired
      return res.status(400).json({
        message: "Token is Invalid or Expired",
      });
    }

    // update users paswword and set resetToken & expiry to undefined
    user.password = NewPassword;
    // also add confirm password
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    res
      .status(200)
      .json(new ApiResponse(200, {}, "Password Reset Successfully"));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const googleLogin = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err || !user) {
      return res.redirect(
        "https://wearclothings.vercel.app/account/login?success=false"
      );
    }

    req.login(user, (err) => {
      if (err) {
        return res.redirect(
          "https://wearclothings.vercel.app/account/login?success=false"
        );
      }

      // Redirect to your frontend with a success query param
      return res.redirect(
        "https://wearclothings.vercel.app/account/login?success=true"
      );
    });
  })(req, res, next); // Call the passport function with req, res, and next
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  loginSuccess,
  loginFailed,
  forgotpassword,
  resetpassword,
  googleLogin,
};
