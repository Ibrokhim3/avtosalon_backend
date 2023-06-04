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
  carPrice: {
    type: Number,
    required: true,
  },
  carCategory: {
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
    unique: true,
    required: true,
  },
});

const Cars = mongoose.model("cars", carsSchema);

module.exports = Cars;
