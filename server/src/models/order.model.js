const { UUID, UUIDV4 } = require("sequelize");
const sequelize = require("../db/connectToMysql");

const Order = sequelize.define("order", {
  id: {
    type: UUID, // Use UUID data type
    defaultValue: UUIDV4, // Automatically generates a UUID
    allowNull: false,
    primaryKey: true,
  },
});
module.exports = Order;
