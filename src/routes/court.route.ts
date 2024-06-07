import express from 'express';
import authentication from '../middlewares/authentication';
import validate from '../utils/validate';
import { Author } from '../middlewares/authorization';
import courtController from '../controllers/court.controller';
import { RoleEnum } from '../utils/enums';
import { createCourtSchema } from '../models/validateSchema/createCourt.validate.schema';
import upload from '../config/multerConfig';

const courtRoute = express.Router();

courtRoute.get('/', courtController.getAllCourt);
courtRoute.get('/:id', courtController.getCourtById);
courtRoute.post('/search', courtController.searchCourt);

courtRoute.use(authentication);
courtRoute.post(
  '/',
  Author([RoleEnum.MANAGER, RoleEnum.ADMIN]),
  validate(createCourtSchema),
  upload.fields([
    {
      name: 'images',
      maxCount: 10
    },
    {
      name: 'data'
    }
  ]),
  courtController.createCourt
);

export default courtRoute;
