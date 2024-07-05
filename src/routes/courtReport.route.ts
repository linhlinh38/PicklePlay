import express from 'express';
import authentication from '../middlewares/authentication';
import CourtReportController from '../controllers/courtReport.controller';

const router = express.Router();
router.use(authentication);
router.get('/get-by-staff/:staffId', CourtReportController.getReportsOfCourt);
router.get('/get-by-court/:courtId', CourtReportController.getReportsOfCourt);
router.get(
  '/get-by-branch/:branchId',
  CourtReportController.getReportsOfBranch
);
router.post('/create/:courtId', CourtReportController.createCourtReport);
router.get('/get-by-id/:id', CourtReportController.getById);
router.put('/:id', CourtReportController.update);
router.delete('/:id', CourtReportController.delete);
export default router;
