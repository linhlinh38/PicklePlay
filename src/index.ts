import mongoose from 'mongoose';
import { config } from './config/envConfig';
import express from 'express';
import http from 'http';
import { errorHandler } from './errors/globalErrorHandler';
import router from './routes/index.route';
import Logging from './utils/Logging';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();

const StartServer = () => {
  app.use(express.urlencoded({ extended: true }));
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  app.use(express.json());
  app.use(cors());

  // Log the request and response
  app.use((req, res, next) => {
    Logging.info(
      `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
    );

    res.on('finish', () => {
      Logging.info(`STATUS: [${res.statusCode}]`);
    });

    next();
  });

  // Rules for calling API
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method == 'OPTIONS') {
      res.header(
        'Access-Control-Allow-Methods',
        'PUT, POST, PATCH, DELETE, GET'
      );
      return res.status(200).json({});
    }

    next();
  });

  // Healthcheck
  app.get('/ping', (req, res, next) =>
    res.status(200).json({ hello: 'world' })
  );

  //Routes
  app.use('/pickle-play', router);

  app.use(errorHandler);

  http
    .createServer(app)
    .listen(config.port, () =>
      Logging.info(`Server is running on port ${config.port}`)
    );
};

/** Connect to Mongo */
mongoose.set('strictQuery', false);

// for debug mongodb

// mongoose.set('debug', function(col, method, query, doc) {
//   console.log('Mongoose:', col, method, query, doc);
// });
mongoose
  .connect(config.mongo_uri, { retryWrites: true, w: 'majority' })
  .then(() => {
    Logging.info('Connected to Mongo');
    StartServer();
  })
  .catch((error) => Logging.error(error));
