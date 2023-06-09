const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const User = require("../models/user-model");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../config/cloudinary-config");
const Cars = require("../models/car-model");
const Users = require("../models/user-model");
const { default: mongoose } = require("mongoose");

const SIGNUP = async (req, res) => {
  try {
    let { userEmail, password, password2, userRole } = req.body;

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

    const profileImg = result?.secure_url;
    const publicId = result?.public_id;

    //deleting the file from folder

    fs.unlink(path.resolve("assets/" + filename), function (err) {
      if (err) throw err;
      console.log("File deleted!");
    });

    const hashedPsw = await bcrypt.hash(password, 12);

    userRole = userRole ? userRole : "user";

    let newUser = await User({
      userEmail,
      password: hashedPsw,
      profileImg,
      publicId,
      userRole,
    });

    await newUser.save();

    return res.status(201).json("Signup!");
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
      return res
        .status(400)
        .json({ msg: "You already bought this car", isBought: true });
    }

    user.purchasedCars.push(id);

    await user.save();

    return res
      .status(201)
      .json({ msg: "You have bought the car!", isBought: false });
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

    const user = await Users.findOne({ _id: userData.userId });
    if (!user) return res.status(404).json("User not found");

    const findUserId = car.likes.find((item) => {
      return item === userData.userId;
    });

    const findCarId = user.likedCars.find((item) => {
      return item === id;
    });

    if (findUserId && findCarId) {
      await Cars.updateOne(
        { _id: id },
        {
          $pull: {
            likes: userData.userId,
          },
        }
      );

      await Users.updateOne(
        { _id: userData.userId },
        {
          $pull: {
            likedCars: id,
          },
        }
      );

      // await car.update({ _id: id }, { $pull: { likes: userData.userId } });

      return res
        .status(201)
        .json({ msg: "Like removed", likeNumber: car.likes, isLiked: false });
    }

    car.likes.push(userData.userId);

    await car.save();

    user.likedCars.push(id);

    await user.save();

    return res.status(201).json({
      msg: "You liked the car!",
      likeNumber: car.likes,
      isLiked: true,
    });
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

    if (userData.userRole !== "admin") {
      return res
        .status(400)
        .json({ error: true, message: "Only admins can see users' list" });
    }

    const users = await Users.find();

    return res.status(200).json(users);
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const DELETE_USER_BY_ADMIN = async (req, res) => {
  try {
    const { token } = req.headers;

    const userData = jwt.verify(token, process.env.SECRET_KEY);

    // if (userData.userRole !== "admin") {
    //   return res.status(400).json("You have no rights to control admin-panel!");
    // }

    let { id } = req.body;

    id = id ? id : userData.userId;

    const user = await Users.findOne({ _id: id });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    try {
      result = await cloudinary.api.delete_resources([user.publicId]);

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

    await Users.findOneAndDelete({ _id: id });

    return res.status(200).json("User deleted!");
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

const UPDATE_USER_BY_ADMIN = async (req, res) => {
  try {
    const { token } = req.headers;

    const userData = jwt.verify(token, process.env.SECRET_KEY);

    // if (userData.userRole !== "admin") {
    //   return res.status(400).json("You have no rights to control admin-panel!");
    // }

    let { userEmail, password, password2, userRole, id } = req.body;

    id = id ? id : userData.userId;

    if (password !== password2) {
      return res.status(400).json("Passwords weren't matched. Try again!");
    }

    const selectUser = await Users.findOne({ _id: id });

    if (req.files) {
      try {
        result = await cloudinary.api.delete_resources([selectUser.publicId]);

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
    }

    let profileImg = "";

    if (req.files) {
      const { name, size, mv } = req.files.profileImg;

      if (+size / 1048576 > 2) {
        return res
          .status(400)
          .json("The size of the image must not be over 2mb");
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
        result = await cloudinary.uploader.upload(
          "assets/" + filename,
          options
        );
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

      publicId = result?.public_id;
      profileImg = result?.secure_url;

      //deleting the file from folder

      fs.unlink(path.resolve("assets/" + filename), function (err) {
        if (err) throw err;
        console.log("File deleted!");
      });
    }

    const user = await Users.findOne({ _id: id });

    userEmail = userEmail ? userEmail : user.userEmail;
    profileImg = profileImg ? profileImg : user.profileImg;
    userRole = userRole ? userRole : user.userRole;
    publicId = req.files ? publicId : user.publicId;

    const hashedPsw = await bcrypt.hash(password, 12);

    const updateduser = {
      userEmail,
      profileImg,
      publicId,
      password: hashedPsw,
    };

    // await updatedCategory.save();

    await Users.findOneAndUpdate({ _id: id }, updateduser);

    return res.status(200).json("User was updated!");
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

const GET_ONE_USER = async (req, res) => {
  try {
    const { token } = req.headers;

    const userData = jwt.verify(token, process.env.SECRET_KEY);

    //This join doesn't work, because it must loop array

    // const result = await User.aggregate([
    //   { $match: { _id: new mongoose.Types.ObjectId(userData.userId) } },
    //   {
    //     $lookup: {
    //       from: "cars",
    //       localField:  "purchasedCars",
    //       foreignField: "_id",
    //       as: "userDetails",
    //     },
    //   },
    // ]);

    // if (result.length === 0) {
    //   return res.status(404).send("User not found");
    // }

    // res.status(200).json(result[0].userDetails);

    const user = await Users.findById(userData.userId);

    const purchasedCars = await Cars.find({ _id: { $in: user.purchasedCars } });
    const likedCars = await Cars.find({ _id: { $in: user.likedCars } });

    return res.status(200).json({ likedCars, purchasedCars, user });
  } catch (error) {
    console.log(error.message);
    return res
      .status(500)
      .json({ error: true, message: "Internal server error" });
  }
};

module.exports = {
  LOGIN,
  SIGNUP,
  BUY,
  LIKE,
  GET_USERS,
  GET_ONE_USER,
  DELETE_USER_BY_ADMIN,
  UPDATE_USER_BY_ADMIN,
};
