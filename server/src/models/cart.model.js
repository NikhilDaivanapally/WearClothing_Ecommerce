const { UUID, UUIDV4 } = require("sequelize");
const sequelize = require("../db/connectToMysql");

const Cart = sequelize.define("cart", {
  id: {
    type: UUID, // Use UUID data type
    defaultValue: UUIDV4, // Automatically generates a UUID
    allowNull: false,
    primaryKey: true,
  },
});
module.exports = Cart;
