const { UUID, UUIDV4, STRING, INTEGER, DATE } = require("sequelize");
const sequelize = require("../db/connectToMysql");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const User = sequelize.define(
  "User",
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: STRING,
      allowNull: false,
      unique: true,
    },
    profileimage: {
      type: STRING,
      allowNull: false,
    },
    email: {
      type: STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
      set(value) {
        this.setDataValue("email", value.trim().toLowerCase());
      },
    },
    phonenumber: {
      type: STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: STRING,
      allowNull: true,
      validate: {
        isValidPassword(value) {
          if (!this.googleId && !value) {
            throw new Error("Password is required for local signups");
          }
        },
      },
    },
    googleId: {
      type: STRING,
      allowNull: true,
    },
    role: {
      type: STRING,
      allowNull: false,
      defaultValue: "user",
    },
    passwordResetToken: {
      type: STRING,
      allowNull: true,
    },
    passwordResetExpires: {
      type: DATE,
      allowNull: true,
    },
  },
  {
    timestamps: true,
    tableName: "users",
  }
);

// Hook to hash the password before creating a new user
User.beforeCreate(async (user) => {
  if (user.password) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

// Hook to hash the password before updating a user
User.beforeUpdate(async (user) => {
  if (user.changed("password")) {
    user.password = await bcrypt.hash(user.password, 10);
  }
});

User.beforeCreate(async (user) => {
  if (user.phonenumber) {
    user.phonenumber = await bcrypt.hash(user.phonenumber, 10);
  }
});

User.beforeUpdate(async (user) => {
  if (user.changed("phonenumber")) {
    user.phonenumber = await bcrypt.hash(user.phonenumber, 10);
  }
});

User.prototype.validPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

User.prototype.createPasswordResetToken = async function () {
  // Generate reset token
  const resetToken = crypto.randomBytes(32).toString("hex");
  // Hash the token and set it to the model instance
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set token expiry (e.g., 1 hour from now)
  this.passwordResetExpires = Date.now() + 3600000; // 1 hour in milliseconds

  await this.save();

  // Return the plain token to send via email
  return resetToken;
};


module.exports = User;
