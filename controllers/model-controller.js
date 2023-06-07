const Cars = require("../models/car-model");
const Category = require("../models/category-model");
const cloudinary = require("../config/cloudinary-config");
const fs = require("fs");
const path = require("path");
const { v4 } = require("uuid");
const jwt = require("jsonwebtoken");

module.exports = {
  GET_ONE_MODEL: async (req, res) => {
    try {
      const { id } = req.params;
      const car = await Cars.findOne({ _id: id });
      return res.status(200).json(car);
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  },
  GET_MODELS_BY_CATEGORY: async (req, res) => {
    try {
      const { id } = req.params;
      const cars = await Cars.find({ categoryId: id });
      return res.status(200).json(cars);
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  },
  GET_MODELS: async (req, res) => {
    try {
      const cars = await Cars.find();

      return res.status(200).json(cars);
    } catch (error) {
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  },
  ADD_MODEL: async (req, res) => {
    try {
      const { token } = req.headers;

      const userData = jwt.verify(token, process.env.SECRET_KEY);

      if (userData.userRole !== "admin") {
        return res
          .status(400)
          .json("You have no rights to control admin-panel!");
      }

      const {
        carName,
        carPrice,
        tonirovka,
        motor,
        year,
        color,
        distance,
        gearbox,
        desc,
        carCategory,
      } = req.body;

      const { name, size, mv } = req.files.carImg;

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

      const carImgUrl = result?.secure_url;
      const publicId = result?.public_id;

      //deleting the file from folder

      fs.unlink(path.resolve("assets/" + filename), function (err) {
        if (err) throw err;
        console.log("File deleted!");
      });

      const category = await Category.findOne({ categoryName: carCategory });

      const categoryId = category._id;

      const newModel = await Cars({
        carName,
        carPrice,
        tonirovka,
        motor,
        year,
        color,
        distance,
        gearbox,
        desc,
        allExp: +carPrice + 50000,
        carImg: carImgUrl,
        publicId,
        categoryId,
        createdBy: userData.userId,
      });

      await newModel.save();

      return res.status(201).json("Model added");
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  },
  UPDATE_MODEL: async (req, res) => {
    try {
      const { token } = req.headers;

      const userData = jwt.verify(token, process.env.SECRET_KEY);

      if (userData.userRole !== "admin") {
        return res
          .status(400)
          .json("You have no rights to control admin-panel!");
      }

      let {
        id,
        carName,
        carPrice,
        tonirovka,
        motor,
        year,
        color,
        distance,
        gearbox,
        desc,
        allExp,
        categoryId,
        publicId,
      } = req.body;

      if (req.files) {
        try {
          result = await cloudinary.api.delete_resources([publicId]);

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

      let carImg = "";

      if (req.files) {
        const { name, size, mv } = req.files.carImg;

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
        carImg = result?.secure_url;

        //deleting the file from folder

        fs.unlink(path.resolve("assets/" + filename), function (err) {
          if (err) throw err;
          console.log("File deleted!");
        });
      }

      const car = await Cars.findOne({ _id: id });

      carName = carName ? carName : car.carName;
      carPrice = carPrice ? carPrice : car.carPrice;
      tonirovka = tonirovka ? tonirovka : car.tonirovka;
      motor = motor ? motor : car.motor;
      year = year ? year : car.year;
      color = color ? color : car.color;
      distance = distance ? distance : car.distance;
      gearbox = gearbox ? gearbox : car.gearbox;
      desc = desc ? desc : car.desc;
      allExp = allExp ? allExp : car.allExp;
      categoryId = categoryId ? categoryId : car.categoryId;
      carImg = carImg ? carImg : car.carImg;
      publicId = req.files ? publicId : car.publicId;

      const updatedCar = {
        carName,
        carPrice,
        tonirovka,
        motor,
        year,
        color,
        distance,
        gearbox,
        desc,
        allExp,
        categoryId,
        carImg,
        publicId,
      };

      await Cars.findOneAndUpdate({ _id: id }, updatedCar);

      return res.status(200).json("Model updated!");
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  },
  DELETE_MODEL: async (req, res) => {
    try {
      const { token } = req.headers;

      const userData = jwt.verify(token, process.env.SECRET_KEY);

      if (userData.userRole !== "admin") {
        return res
          .status(400)
          .json("You have no rights to control admin-panel!");
      }

      const { id } = req.body;

      const car = await Cars.findOne({ _id: id });

      if (!car) {
        return res.status(404).json("Car not found!");
      }

      try {
        result = await cloudinary.api.delete_resources([car.publicId]);

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

      await Cars.findOneAndDelete({ _id: id });

      return res.status(200).json("Model deleted!");
    } catch (error) {
      console.log(error.message);
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  },
};
