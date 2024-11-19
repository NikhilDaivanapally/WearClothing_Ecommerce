const { Op } = require("sequelize");
const User = require("../models/user.model");
const { ApiResponse } = require("../utils/ApiResponse");

const getUsers = async (req, res) => {
  const excludeFields = ["password", "phonenumber"];
  const excludedEmail = process.env.ADMIN;
  const page = req.query.page ? req.query.page : 1;
  const sort = req.query.sort ? req.query.sort : "createdAt";
  const order = req.query.order
    ? req.query.order.toUpperCase()
    : "desc".toUpperCase();


  try {
    const users = await User.findAll({
      where: {
        email: {
          [Op.ne]: excludedEmail, // Exclude the user with the specified email
        },
      },
      attributes: {
        exclude: excludeFields,
      },
      order: [[sort, order]],
      limit: 5,
      offset: (page - 1) * 5,
    });

    res
      .status(200)
      .json(new ApiResponse(200, users, "User found Successfully"));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsersCount = async (req, res) => {
  const excludedEmail = process.env.ADMIN;
  try {
    const usersCount = await User.count({
      where: {
        email: {
          [Op.ne]: excludedEmail,
        },
      },
    });
    res
      .status(200)
      .json(
        new ApiResponse(200, usersCount, "UsersCount fetched Successfully")
      );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.id;
  try {
    await User.destroy({ where: { id: userId } });
    res.status(200).json({ message: "User Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const changeUserRole = async (req, res) => {
  const { id, role } = req.body;
  try {
    const user = await User.findByPk(id);
    if (user) {
      user.role = role;
      await user.save();
      res
        .status(200)
        .json(new ApiResponse(200, {}, "User Role Changed Successfully"));
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUsers,
  getUsersCount,
  deleteUser,
  changeUserRole,
};
