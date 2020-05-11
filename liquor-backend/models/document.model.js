const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const documentsSchema = new Schema(
  {
    id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    document: {
      name: { type: String, require: false },
      data: {
        buffer: { type: Buffer, required: false },
        contentType: { type: String, require: false },
      },
    },
  },
  {
    timestamps: true,
  }
);

const groceryDB = mongoose.connection.useDb("liquor_db");

const Document = groceryDB.model("Document", documentsSchema);

module.exports = Document;
