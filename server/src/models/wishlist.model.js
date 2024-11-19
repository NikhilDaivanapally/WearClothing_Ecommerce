const { UUID, UUIDV4 } = require("sequelize");
const sequelize = require("../db/connectToMysql");

const Wishlist = sequelize.define("wishlist", {
  id: {
    type: UUID, // Use UUID data type
    defaultValue: UUIDV4, // Automatically generates a UUID
    allowNull: false,
    primaryKey: true,
  },
});
module.exports = Wishlist;
