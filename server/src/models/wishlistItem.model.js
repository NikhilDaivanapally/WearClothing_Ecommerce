const { UUID, UUIDV4 } = require("sequelize");
const sequelize = require("../db/connectToMysql");

const WishlistItem = sequelize.define("wishlistitem", {
  id: {
    type: UUID,
    defaultValue: UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
});

module.exports = WishlistItem;
