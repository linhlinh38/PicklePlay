import mongoose from 'mongoose';
import { config } from './config/envConfig';
import express from 'express';
import http from 'http';
import Logging from './utils/logging';
import indexRoute from './routes/index.route';
const app = express();

const StartServer = () => {
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use('/', indexRoute);

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
