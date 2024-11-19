const { UUID, UUIDV4, INTEGER, ENUM } = require("sequelize");
const sequelize = require("../db/connectToMysql");

const CartItem = sequelize.define("cartitem", {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  quantity: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 1,
  },
  size: {
    type: ENUM,
    values: ["XS", "S", "M", "L", "XL", "XXL"],
    allowNull: false,
  },
});

module.exports = CartItem;
