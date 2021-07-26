import express from "express";
import dotenv from "dotenv";
import routers from "./routers/index.js";
import mongoose from "mongoose";
import { customErrorHandler } from "./middlewares/errors/customErrorHandler.js";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import bodyParser from "body-parser";

//ENVIRONMENT
dotenv.config({
  path: "./config/env/config.env",
});

const app = express();

//CORS
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

// EXPRESS - BODY MIDDLEWARE
app.use(express.json());

const PORT = process.env.PORT;

//ROUTER MIDDLEWARE
app.use("/api", routers);

//ERROR MIDDLEWARE
app.use(customErrorHandler);

//Express Static files
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, (res, req) => {
      console.log(
        `MongoDb connection successful and app started on port ${PORT} : Environment ${process.env.NODE_ENV}`
      );
    });
  })
  .catch((err) => console.error(err));
