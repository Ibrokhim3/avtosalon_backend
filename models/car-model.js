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
  carImg1: {
    type: String,
    required: true,
  },
  carImg2: {
    type: String,
    required: true,
  },
  carImg3: {
    type: String,
    required: true,
  },
  publicId: {
    type: String,
    required: true,
    unique: true,
  },
  publicId1: {
    type: String,
    required: true,
    unique: true,
  },
  publicId2: {
    type: String,
    required: true,
    unique: true,
  },
  publicId3: {
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
  purchasedBy: [String],
});

const Cars = mongoose.model("cars", carsSchema);

module.exports = Cars;
