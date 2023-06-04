const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4 } = require("uuid");
const User = require("../models/user-model");
const path = require("path");
const fs = require("fs");
const cloudinary = require("../config/cloudinary-config");

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
      res.status(500).json({ error: true, message: "Internal server error" });
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
    res.status(500).json({ error: true, message: "Internal server error" });
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

    res.status(201).json({ token, msg: "You're logged in" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: true, message: "Internal server error" });
  }
};

module.exports = { LOGIN, SIGNUP };
