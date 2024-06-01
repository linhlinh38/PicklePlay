import express from 'express';
import Logging from '../utils/logging';
import authRoute from './auth.route';
import userRoute from './user.route';
import { errorHandler } from '../errors/globalErrorHandler';

const router = express.Router();
// Log the request and response
router.use((req, res, next) => {
  Logging.info(
    `METHOD: [${req.method}] - URL: [${req.url}] - IP: [${req.socket.remoteAddress}]`
  );

  res.on('finish', () => {
    Logging.info(`STATUS: [${res.statusCode}]`);
  });

  next();
});

// Rules for calling AP
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }

  next();
});

// Healthcheck
router.get('/ping', (req, res, next) =>
  res.status(200).json({ hello: 'world' })
);

//Routes
router.use('/user', userRoute);
router.use('/auth', authRoute);

router.use(errorHandler);
export default router;
