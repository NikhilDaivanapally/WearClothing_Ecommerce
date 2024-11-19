const sequelize = require("../db/connectToMysql");
const { DataTypes } = require("sequelize");
const Category = require("./category.model");
const { UUID, UUIDV4, STRING, DECIMAL, JSON } = DataTypes;

const Product = sequelize.define(
  "products",
  {
    id: {
      type: UUID,
      defaultValue: UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    brand: {
      type: STRING,
      allowNull: true,
    },
    name: {
      type: STRING,
      allowNull: false,
    },
    price: {
      type: DECIMAL(10, 2),
      allowNull: false,
    },
    sizes: {
      type: JSON,
      allowNull: false,
      defaultValue: { S: 0, M: 0, L: 0, XL: 0, XXL: 0 },
    },
    material: {
      type: STRING,
      allowNull: false,
    },
    size: {
      type: STRING,
      allowNull: false,
    },
    fit: {
      type: STRING,
      allowNull: false,
    },
    washcare: {
      type: STRING,
      allowNull: false,
      defaultValue: "Machine Wash",
    },
    images: {
      type: DataTypes.JSON, // Use JSON to store the array of image URLs
      allowNull: true,
    },
    categoryId: {
      type: UUID,
      allowNull: false, // Each product must belong to a subcategory
    },
  },
  {
    tableName: "products",
    timestamps: true,
    hooks: {
      beforeSave: (product) => {
        // Trim spaces for all STRING fields
        if (product.brand) {
          product.set("brand", product.brand.trim());
        }
        if (product.name) {
          product.set("name", product.name.trim());
        }
        if (product.material) {
          product.set("material", product.material.trim());
        }
        if (product.size) {
          product.set("size", product.size.trim());
        }
        if (product.fit) {
          product.set("fit", product.fit.trim());
        }
        if (product.washcare) {
          product.set("washcare", product.washcare.trim());
        }
      },
    },
  }
);

// Each Product belongs to a specific Category (deepest subcategory)
Product.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "category",
});

module.exports = Product;
