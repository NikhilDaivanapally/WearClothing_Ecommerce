const { UUID, UUIDV4, INTEGER } = require("sequelize");
const sequelize = require("../db/connectToMysql");

const OrderItem = sequelize.define("orderItem", {
  id: {
    type: UUID, // Use UUID data type
    defaultValue: UUIDV4, // Automatically generates a UUID
    allowNull: false,
    primaryKey: true,
  },
  quantity:{
    type:INTEGER
  }
});
module.exports = OrderItem;
