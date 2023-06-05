require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectToDb = require("./config/connect-to-db");
const authRouter = require("./routes/auth-router");
const categoryRouter = require("./routes/category-router");
const modelRouter = require("./routes/model-router");
const upload = require("express-fileupload");
const path = require("path");

const app = express();

app.use(express.json());
app.use(cors());
app.use(upload());
app.use(express.static(path.join(process.cwd(), "./assets")));

app.use("/avtosalon", authRouter);
app.use("/avtosalon", categoryRouter);
app.use("/avtosalon", modelRouter);

connectToDb();

const PORT = process.env.PORT || 2005;

app.listen(PORT, () => {
  console.log(`Server ${PORT} is running`);
});
