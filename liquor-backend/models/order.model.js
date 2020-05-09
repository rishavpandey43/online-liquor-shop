const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    orderedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
    },
    orderedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String, required: true },
        value: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: String, required: true },
      },
    ],
    status: { type: String, required: true },
    paymentMode: { type: String, required: true },
    amount: {
      itemsPrice: { type: Number, required: true },
      deliveryCharge: { type: Number, required: true },
    },
    deliveryAddress: {
      type: { type: String, required: false },
      street: { type: String, required: false },
      landmark: { type: String, required: false },
      city: { type: String, required: false },
      pincode: { type: Number, required: false },
    },
    deliveryAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryAgent",
    },
  },
  {
    timestamps: true,
  }
);

const groceryDB = mongoose.connection.useDb("liquor_db");

const Order = groceryDB.model("order", orderSchema);

module.exports = Order;
