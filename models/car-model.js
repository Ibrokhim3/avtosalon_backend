const mongoose = require("mongoose");

const carsSchema = new mongoose.Schema({
  carName: {
    type: String,
    required: true,
  },
  carImg: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
    unique: true,
  },
  carPrice: {
    type: Number,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  tonirovka: {
    type: String,
    required: true,
  },
  motor: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  distance: {
    type: Number,
    required: true,
  },
  gearbox: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  allExp: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: String,
    required: true,
  },
  likes: [String],
});

const Cars = mongoose.model("cars", carsSchema);

module.exports = Cars;
