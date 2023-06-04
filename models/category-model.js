const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true,
    unique: true,
  },
  categoryImg: {
    type: String,
    required: true,
    unique: true,
  },
  createdBy: {
    type: String,
  },
});

const categories = mongoose.model("categories", categorySchema);

module.exports = categories;
