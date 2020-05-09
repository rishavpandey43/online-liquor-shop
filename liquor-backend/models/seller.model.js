const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const sellerSchema = new Schema(
  {
    fcm: {
      token: { type: String, required: false },
      status: { type: Boolean, required: false },
    },
    personalDetail: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      phone: { type: String, required: true },
      authyId: { type: String, required: false },
    },
    profileVerificationDetail: {
      type: { type: String, require: false },
      number: { type: Number, require: false },
      verified: { type: Boolean, required: true },
      document: {
        name: { type: String, require: false },
        data: { data: Buffer, contentType: String },
      },
    },
    storeDetail: {
      name: { type: String, required: false },
      address: {
        street: { type: String, required: false },
        landmark: { type: String, required: false },
        city: { type: String, required: false },
        pincode: { type: Number, required: false },
        // loc: {
        //   longitude: { type: String, required: false },
        //   latitude: { type: String, required: false },
        // },
      },
      panCard: { type: String, required: false },
      gstNumber: { type: String, required: false },
      document: { type: Buffer, required: false },
      verified: { type: Boolean, required: true },
      rating: { type: Number, required: false },
    },
    bankDetail: {
      name: { type: String, required: false },
      accountNumber: { type: Number, required: false },
      ifscCode: { type: String, required: false },
      branchName: { type: String, required: false },
      verified: { type: Boolean, required: true },
    },
    products: [
      {
        root: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        variants: [
          {
            value: { type: String, required: false },
            price: { type: Number, required: false },
            stock: { type: Number, required: false },
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const groceryDB = mongoose.connection.useDb("liquor_db");

const Seller = groceryDB.model("Seller", sellerSchema);

module.exports = Seller;
