const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const User = require("../models/user-model");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../config/cloudinary-config");
const Cars = require("../models/car-model");
const Users = require("../models/user-model");

const SIGNUP = async (req, res) => {
  try {
    const { userEmail, password, password2 } = req.body;

    if (password !== password2) {
      return res.status(400).json({ msg: "Password's weren't matched" });
    }

    const user = await User.findOne({ userEmail });

    if (user) {
      return res.status(400).json({ msg: "This user already exists" });
    }

    const { name, size, mv } = req.files.profileImg;

    if (+size / 1048576 > 2) {
      return res.status(400).json("The size of the image must not be over 2mb");
    }

    const filename = v4() + path.extname(name);

    mv(path.resolve("assets/" + filename), (err) => {
      if (err)
        return res
          .status(400)
          .json("Something went wrong, while uploading a file");
    });

    //Uploading file to the cloudinary server:

    let result = null;

    const options = {
      folder: "avtosalon",
      use_filename: true,
      unique_filename: false,
      overwrite: true,
    };

    try {
      result = await cloudinary.uploader.upload("assets/" + filename, options);
      if (!result) {
        return res.status(500).json("Internal server error");
      }
      // console.log(result);
      // return result.public_id;
    } catch (error) {
      // console.log(error.message);
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }

    const profileImgUrl = result?.secure_url;

    //deleting the file from folder

    fs.unlink(path.resolve("assets/" + filename), function (err) {
      if (err) throw err;
      console.log("File deleted!");
    });

    const hashedPsw = await bcrypt.hash(password, 12);

    let newUser = await User({ userEmail, password: hashedPsw, profileImgUrl });

    await newUser.save();

    return res.status(201).json("Signup");
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const LOGIN = async (req, res) => {
  try {
    const { userEmail, password } = req.body;

    const user = await User.findOne({ userEmail });
    if (!user) return res.status(404).json("User not found");

    const comparePsw = await bcrypt.compare(password, user.password);

    if (!comparePsw) return res.status(401).json("Invalid password!");

    const token = jwt.sign(
      { userId: user._id, userRole: user.userRole },
      process.env.SECRET_KEY,
      {
        expiresIn: process.env.JWT_TIME,
      }
    );

    const userRole = user.userRole;

    return res.status(201).json({ token, userRole, msg: "You're logged in" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const BUY = async (req, res) => {
  try {
    const { id } = req.body;

    const { token } = req.headers;

    const userData = jwt.verify(token, process.env.SECRET_KEY);

    const car = await Cars.findOne({ _id: id });
    if (!car) return res.status(404).json("Car not found");

    const user = await Users.findOne({ _id: userData.userId });

    const findId = user.purchasedCars.find((item) => {
      return item === id;
    });

    if (findId) {
      return res.status(400).json("You already bought this car");
    }

    user.purchasedCars.push(id);

    await user.save();

    return res.status(201).json({ msg: "You have bought the car!" });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const LIKE = async (req, res) => {
  try {
    const { id } = req.body;

    const { token } = req.headers;

    const userData = jwt.verify(token, process.env.SECRET_KEY);

    const car = await Cars.findOne({ _id: id });
    if (!car) return res.status(404).json("Car not found");

    // const user = await Users.findOne({ _id: userData.userId });

    const findId = car.likes.find((item) => {
      return item === userData.userId;
    });

    if (findId) {
      // const userIndex = car.likes.indexOf(findId);

      // await car.likes.pull({ id });

      await Cars.updateOne(
        { _id: id },
        {
          $pull: {
            likes: userData.userId,
          },
        }
      );

      // await car.update({ _id: id }, { $pull: { likes: userData.userId } });

      return res
        .status(201)
        .json({ msg: "Like removed", likeNumber: car.likes });
    }

    car.likes.push(userData.userId);

    await car.save();

    // user.likedCars.push(id);

    // await user.save();

    return res
      .status(201)
      .json({ msg: "You liked the car!", likeNumber: car.likes });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const GET_USERS = async (req, res) => {
  try {
    const { token } = req.headers;

    const userData = jwt.verify(token, process.env.SECRET_KEY);

    const users = await Users.find({ _id: userData.userId });

    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

module.exports = { LOGIN, SIGNUP, BUY, LIKE, GET_USERS };
