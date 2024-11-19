const { UUID, UUIDV4, STRING } = require("sequelize");
const sequelize = require("../db/connectToMysql");

const Category = sequelize.define(
  "categories",
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    parentId: {
      type: UUID, // Self-referencing field for subcategories
      allowNull: true, // Root-level categories have null parentId
    },
    // onDelete: "CASCADE",
  },
  {
    tableName: "categories",
    timestamps: true,
  }
);

// Self-referencing association: A Category has many subcategories
Category.hasMany(Category, {
  as: "subcategories", // Alias for child categories
  foreignKey: "parentId",
});

Category.belongsTo(Category, {
  as: "parent", // Alias for parent category
  foreignKey: "parentId",
});

module.exports = Category;
