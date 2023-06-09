const Cars = require("../models/car-model");
const Category = require("../models/category-model");
const cloudinary = require("../config/cloudinary-config");
const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");
const { options } = require("joi");

module.exports = {
  GET_ONE_CATEGORY: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await Category.findOne({ _id: id });
      return res.status(200).json(category);
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  },
  GET_CATEGORIES: async (req, res) => {
    try {
      const categories = await Category.find();

      return res.status(200).json(categories);
    } catch (error) {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  },
  ADD_CATEGORY: async (req, res) => {
    try {
      const { token } = req.headers;

      const userData = jwt.verify(token, process.env.SECRET_KEY);

      if (userData.userRole !== "admin") {
        return res
          .status(400)
          .json("You have no rights to control admin-panel!");
      }

      const { categoryName } = req.body;

      const { name, size, mv } = req.files.categoryImg;

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
          return res
            .status(500)
            .json("Internal server error in cloudinary. Try again");
        }
        // return result?.public_id;
      } catch (error) {
        // console.log(error.message);
        return res.status(500).json({
          error: true,
          message: "Internal server error in cloudinary. Try again",
        });
      }

      const categoryImgUrl = result.secure_url;
      const publicId = result.public_id;

      //deleting the file from folder

      fs.unlink(path.resolve("assets/" + filename), function (err) {
        if (err) throw err;
        console.log("File deleted!");
      });

      const newCategory = await Category({
        categoryName,
        categoryImg: categoryImgUrl,
        // createdBy: userData.userId,
        publicId,
      });

      await newCategory.save();

      return res.status(201).json("Category added!");
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  },
  UPDATE_CATEGORY: async (req, res) => {
    try {
      const { token } = req.headers;

      const userData = jwt.verify(token, process.env.SECRET_KEY);

      if (userData.userRole !== "admin") {
        return res
          .status(400)
          .json("You have no rights to control admin-panel!");
      }

      let { categoryName, id } = req.body;

      const selectCategory = await Category.findOne({ _id: id });

      if (req.files) {
        try {
          result = await cloudinary.api.delete_resources([
            selectCategory.publicId,
          ]);

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

      let categoryImg = "";

      if (req.files) {
        const { name, size, mv } = req.files.categoryImg;

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

        publicId = result.public_id;
        categoryImg = result.secure_url;

        //deleting the file from folder

        fs.unlink(path.resolve("assets/" + filename), function (err) {
          if (err) throw err;
          console.log("File deleted!");
        });
      }

      const category = await Category.findOne({ _id: id });

      categoryName = categoryName ? categoryName : category.categoryName;
      categoryImg = categoryImg ? categoryImg : category.categoryImg;
      publicId = req.files ? publicId : category.publicId;

      const updatedCategory = {
        categoryName,
        categoryImg,
        publicId,
      };

      // await updatedCategory.save();

      await Category.findOneAndUpdate({ _id: id }, updatedCategory);

      return res.status(200).json("Category updated!");
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  },
  DELETE_CATEGORY: async (req, res) => {
    try {
      const { token } = req.headers;

      const userData = jwt.verify(token, process.env.SECRET_KEY);

      if (userData.userRole !== "admin") {
        return res
          .status(400)
          .json("You have no rights to control admin-panel!");
      }

      const { id } = req.body;

      const category = await Category.findOne({ _id: id });

      if (!category) {
        return res.status(404).json("Category not found!");
      }

      try {
        result = await cloudinary.api.delete_resources([category.publicId]);

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

      await Category.findOneAndDelete({ _id: id });

      return res.status(200).json("Category deleted!");
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  },
};
