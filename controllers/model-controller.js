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
      const { name: name1, size: size1, mv: mv1 } = req.files.carImg1;
      const { name: name2, size: size2, mv: mv2 } = req.files.carImg2;
      const { name: name3, size: size3, mv: mv3 } = req.files.carImg3;

      if (
        +size / 1048576 > 2 &&
        +size1 / 1048576 > 2 &&
        +size2 / 1048576 > 2 &&
        +size3 / 1048576 > 2
      ) {
        return res
          .status(400)
          .json("The size of the one image must not be over 2mb");
      }

      const filename = v4() + path.extname(name);
      const filename1 = v4() + path.extname(name1);
      const filename2 = v4() + path.extname(name2);
      const filename3 = v4() + path.extname(name3);

      mv(path.resolve("assets/" + filename), (err) => {
        if (err)
          return res
            .status(400)
            .json("Something went wrong, while uploading a file");
      });

      mv1(path.resolve("assets/" + filename1), (err) => {
        if (err)
          return res
            .status(400)
            .json("Something went wrong, while uploading a file");
      });

      mv2(path.resolve("assets/" + filename2), (err) => {
        if (err)
          return res
            .status(400)
            .json("Something went wrong, while uploading a file");
      });

      mv3(path.resolve("assets/" + filename3), (err) => {
        if (err)
          return res
            .status(400)
            .json("Something went wrong, while uploading a file");
      });

      //Uploading file to the cloudinary server:

      let result = null;
      let result1 = null;
      let result2 = null;
      let result3 = null;

      const options = {
        folder: "avtosalon",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };

      //file

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

      //file1

      try {
        result1 = await cloudinary.uploader.upload(
          "assets/" + filename1,
          options
        );
        if (!result1) {
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

      //file2

      try {
        result2 = await cloudinary.uploader.upload(
          "assets/" + filename2,
          options
        );
        if (!result2) {
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

      //file3

      try {
        result3 = await cloudinary.uploader.upload(
          "assets/" + filename3,
          options
        );
        if (!result3) {
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

      const carImgUrl = result.secure_url;
      const carImgUrl1 = result1.secure_url;
      const carImgUrl2 = result2.secure_url;
      const carImgUrl3 = result3.secure_url;
      const publicId = result.public_id;
      const publicId1 = result1.public_id;
      const publicId2 = result2.public_id;
      const publicId3 = result3.public_id;

      //deleting the file from folder

      fs.unlink(path.resolve("assets/" + filename), function (err) {
        if (err) throw err;
        console.log("Files deleted!");
      });

      fs.unlink(path.resolve("assets/" + filename1), function (err) {
        if (err) throw err;
        console.log("Files deleted!");
      });

      fs.unlink(path.resolve("assets/" + filename2), function (err) {
        if (err) throw err;
        console.log("Files deleted!");
      });

      fs.unlink(path.resolve("assets/" + filename3), function (err) {
        if (err) throw err;
        console.log("Files deleted!");
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
        carImg1: carImgUrl1,
        carImg2: carImgUrl2,
        carImg3: carImgUrl3,
        publicId,
        publicId1,
        publicId2,
        publicId3,
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
      } = req.body;

      let car = await Cars.findOne({ _id: id });

      if (!car) {
        return res.status(404).json("Car not found!");
      }

      if (req.files) {
        try {
          result = await cloudinary.api.delete_resources([
            car.publicId,
            car.publicId1,
            car.publicId2,
            car.publicId3,
          ]);

          if (!result) {
            return res.status(500).json("Internal server error cloudinary");
          }
          // console.log(result);
          // return result.public_id;
        } catch (error) {
          // console.log(error.message);
          return res
            .status(500)
            .json({ error: true, message: "Internal server error cloudinary" });
        }
      }

      let carImg = "";
      let carImg1 = "";
      let carImg2 = "";
      let carImg3 = "";

      const options = {
        folder: "avtosalon",
        use_filename: true,
        unique_filename: false,
        overwrite: true,
      };

      if (req.files?.carImg) {
        const { name, size, mv } = req.files?.carImg;

        if (+size / 1048576 > 2) {
          return res
            .status(400)
            .json("The size of the one image must not be over 2mb");
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
        carImg = result.secure_url;

        //deleting the file from folder

        fs.unlink(path.resolve("assets/" + filename), function (err) {
          if (err) throw err;
          console.log("File deleted!");
        });
      }

      if (req.files?.carImg1) {
        const { name: name1, size: size1, mv: mv1 } = req.files?.carImg1;

        if (+size1 / 1048576 > 2) {
          return res
            .status(400)
            .json("The size of the one image must not be over 2mb");
        }

        const filename1 = v4() + path.extname(name1);

        mv1(path.resolve("assets/" + filename1), (err) => {
          if (err)
            return res
              .status(400)
              .json("Something went wrong, while uploading a file");
        });

        //Uploading file to the cloudinary server:

        let result1 = null;

        //file1

        try {
          result1 = await cloudinary.uploader.upload(
            "assets/" + filename1,
            options
          );
          if (!result1) {
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

        publicId1 = result1.public_id;

        carImg1 = result1.secure_url;

        //deleting the file from folder

        fs.unlink(path.resolve("assets/" + filename1), function (err) {
          if (err) throw err;
          console.log("File1 deleted!");
        });
      }

      if (req.files?.carImg2) {
        const { name: name2, size: size2, mv: mv2 } = req.files?.carImg2;

        if (+size2 / 1048576 > 2) {
          return res
            .status(400)
            .json("The size of the one image must not be over 2mb");
        }

        const filename2 = v4() + path.extname(name2);

        mv2(path.resolve("assets/" + filename2), (err) => {
          if (err)
            return res
              .status(400)
              .json("Something went wrong, while uploading a file");
        });

        //Uploading file to the cloudinary server:

        let result2 = null;

        // //file2

        try {
          result2 = await cloudinary.uploader.upload(
            "assets/" + filename2,
            options
          );
          if (!result2) {
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

        publicId2 = result2.public_id;

        carImg2 = result2.secure_url;

        //deleting the file from folder

        fs.unlink(path.resolve("assets/" + filename2), function (err) {
          if (err) throw err;
          console.log("File2 deleted!");
        });
      }

      if (req.files?.carImg3) {
        const { name: name3, size: size3, mv: mv3 } = req.files?.carImg3;

        if (+size3 / 1048576 > 2) {
          return res
            .status(400)
            .json("The size of the one image must not be over 2mb");
        }

        const filename3 = v4() + path.extname(name3);

        mv3(path.resolve("assets/" + filename3), (err) => {
          if (err)
            return res
              .status(400)
              .json("Something went wrong, while uploading a file");
        });

        //Uploading file to the cloudinary server:

        let result3 = null;

        // //file3

        try {
          result3 = await cloudinary.uploader.upload(
            "assets/" + filename3,
            options
          );
          if (!result3) {
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

        publicId3 = result3.public_id;

        carImg3 = result3.secure_url;

        //deleting the file from folder

        fs.unlink(path.resolve("assets/" + filename3), function (err) {
          if (err) throw err;
          console.log("Files deleted!");
        });
      }

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
      carImg1 = carImg1 ? carImg1 : car.carImg1;
      carImg2 = carImg2 ? carImg2 : car.carImg2;
      carImg3 = carImg3 ? carImg3 : car.carImg3;
      publicId = req.files?.carImg ? publicId : car.publicId;
      publicId1 = req.files?.carImg1 ? publicId1 : car.publicId1;
      publicId2 = req.files?.carImg2 ? publicId2 : car.publicId2;
      publicId3 = req.files?.carImg3 ? publicId3 : car.publicId3;

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
        carImg1,
        carImg2,
        carImg3,
        publicId,
        publicId1,
        publicId2,
        publicId3,
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
        result = await cloudinary.api.delete_resources([
          car.publicId,
          car.publicId1,
          car.publicId2,
          car.publicId3,
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
