import express from "express";
import dotenv from "dotenv";
import routers from "./routers/index.js";
import mongoose from "mongoose";
import { customErrorHandler } from "./middlewares/errors/customErrorHandler.js";

//ENVIRONMENT
dotenv.config({
  path: "./config/env/config.env",
});

const app = express();

// EXPRESS - BODY MIDDLEWARE
app.use(express.json());

const PORT = process.env.PORT || 5000;

//ROUTER MIDDLEWARE
app.use("/api", routers);

//ERROR MIDDLEWARE
app.use(customErrorHandler);

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
