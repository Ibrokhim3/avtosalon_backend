require("dotenv").config();
const express = require("express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");
const cors = require("cors");
const connectToDb = require("./config/connect-to-db");
const authRouter = require("./routes/auth-router");
const categoryRouter = require("./routes/category-router");
const modelRouter = require("./routes/model-router");
const upload = require("express-fileupload");
const path = require("path");

const app = express();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Avtosalon",
      version: "1.0.0",
      description: "Avtosalon API Information",
    },
    servers: [
      {
        url: "http://localhost:2004",
      },
    ],
  },
  apis: ["./swagger-docs/*.js"],
};

const swaggerDocs = swaggerJsDoc(options);

app.use(express.json());
app.use(cors());
app.use(upload());
app.use(express.static(path.join(process.cwd(), "./assets")));

app.use("/avtosalon", authRouter);
app.use("/avtosalon", categoryRouter);
app.use("/avtosalon", modelRouter);

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

connectToDb();

const PORT = process.env.PORT || 2005;

app.get("/avtosalon/get-users", (request, response) => {
  response.send(users);
});

app.listen(PORT, () => {
  console.log(`Server ${PORT} is running`);
});
