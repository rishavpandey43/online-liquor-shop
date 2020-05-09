const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    brand: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const groceryDB = mongoose.connection.useDb("liquor_db");

const Product = groceryDB.model("product", productSchema);

module.exports = Product;
