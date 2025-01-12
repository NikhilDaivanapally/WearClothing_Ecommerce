const bcrypt = require("bcryptjs");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user.model");
const Cart = require("../models/cart.model");
const Wishlist = require("../models/wishlist.model");

// Local Strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await User.findOne({ where: { username } });

      if (!user) {
        return done(null, false, { message: "Incorrect username." });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return done(null, false, { message: "Incorrect password." });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  })
);

// Google Strategy

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        "https://wear-clothing-ecommerce-api.vercel.app/api/v1/auth/google/callback",
      scope: [
        "profile",
        "email",
        "https://www.googleapis.com/auth/user.phonenumbers.read",
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const role =
          profile.emails[0].value === process.env.ADMIN ? "Admin" : "user";
        // Find user by email
        let user = await User.findOne({
          where: { email: profile.emails[0].value },
        });

        // If no user, create a new one
        if (!user) {
          user = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            phonenumber: profile.phoneNumbers
              ? profile.phoneNumbers[0].value
              : null, // Assign phone number if available
            profileimage: profile.photos[0].value,
            password: null, // Google users have no password
            googleId: profile.id, // Store Google ID
            role,
          });
        }
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

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user.id); // user.id should now exist
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;
