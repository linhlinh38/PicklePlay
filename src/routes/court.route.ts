import express from 'express';
import authentication from '../middlewares/authentication';
import validate from '../utils/validate';
import { Author } from '../middlewares/authorization';
import courtController from '../controllers/court.controller';
import { RoleEnum } from '../utils/enums';
import { createCourtSchema } from '../models/validateSchema/createCourt.validate.schema';
import { updateCourtSchema } from '../models/validateSchema/updateCourt.validate.schema';

const courtRoute = express.Router();

courtRoute.get('/', courtController.getAllCourt);
courtRoute.get(
  '/get-my-available-courts',
  authentication,
  Author([RoleEnum.MANAGER]),
  courtController.getMyAvailableCourts
);
courtRoute.get('/:id', courtController.getCourtById);
courtRoute.post('/search', courtController.searchCourt);
courtRoute.post('/get-court-available', courtController.getCourtAvailable);

courtRoute.use(authentication);
courtRoute.post(
  '/',
  Author([RoleEnum.MANAGER, RoleEnum.ADMIN]),
  validate(createCourtSchema),
  courtController.createCourt
);

courtRoute.put(
  '/:id',
  Author([RoleEnum.MANAGER, RoleEnum.ADMIN]),
  validate(updateCourtSchema),
  courtController.updateCourt
);

courtRoute.put(
  '/update/status/:id',
  Author([RoleEnum.MANAGER, RoleEnum.ADMIN]),
  courtController.updateCourtStatus
);

courtRoute.delete(
  '/:id',
  Author([RoleEnum.MANAGER, RoleEnum.ADMIN]),
  courtController.deleteCourt
);

courtRoute.get(
  '/get-all-courts-of-manager/:id',
  Author([RoleEnum.ADMIN]),
  courtController.getAllCourtsOfManager
);

export default courtRoute;
