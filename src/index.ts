import mongoose from "mongoose";
import { config } from "./config/envConfig";
import express from "express";
import http from "http";
import Logging from "./utils/Logging";

const router = express();

const StartServer = () => {
  router.use(express.urlencoded({ extended: true }));
  router.use(express.json());

  // Log the request and response
  router.use((req, res, next) => {
    Logging.info(
      `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on("finish", () => {
      Logging.info(`STATUS: [${res.statusCode}]`);
    });

    next();
  });

  // Rules for calling API
  router.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method == "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }

    next();
  });

  // Healthcheck
  router.get("/ping", (req, res, next) =>
    res.status(200).json({ hello: "world" })
  );

  //Routes

  // Server Error
  router.use((req, res, next) => {
    const error = new Error("Not found");
    Logging.error(error);
    res.status(500).json({
      message: error.message,
    });
  });

  http
    .createServer(router)
    .listen(config.port, () =>
      Logging.info(`Server is running on port ${config.port}`)
    );
};

/** Connect to Mongo */
mongoose.set("strictQuery", false);

// for debug mongodb

// mongoose.set('debug', function(col, method, query, doc) {
//   console.log('Mongoose:', col, method, query, doc);
// });
mongoose
  .connect(config.mongo_uri, { retryWrites: true, w: "majority" })
  .then(() => {
    Logging.info("Connected to Mongo");
    StartServer();
  })
  .catch((error) => Logging.error(error));
