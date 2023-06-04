const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  userRole: {
    type: String,
    required: true,
  },
  profileImg: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
  createdBy: {
    type: String,
    unique: String,
  },
  likedCars: [String],
  purchasedCars: [String],
});

const Users = mongoose.model("Users", usersSchema);

module.exports = Users;
