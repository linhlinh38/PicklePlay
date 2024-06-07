import { NextFunction, Request, Response } from 'express';
import { ICourt } from '../interfaces/court.interface';
import { CourtStatusEnum } from '../utils/enums';
import { courtService } from '../services/court.service';

async function createCourt(req: Request, res: Response, next: NextFunction) {
  const newCourt: ICourt = {
    name: req.body.data.name,
    type: req.body.type,
    price: req.body.price,
    images: req.files as Express.Multer.File[],
    description: req.body.description,
    status: CourtStatusEnum.PENDING,
    branch: req.body.branch
  };
  try {
    await courtService.create(newCourt);
    return res.status(201).json({ message: 'Created Court Successfully' });
  } catch (error) {
    next(error);
  }
}

async function getAllCourt(req: Request, res: Response) {
  const court = await courtService.getAll();
  return res.status(200).json({ courtList: court });
}

async function getCourtById(req: Request, res: Response, next: NextFunction) {
  try {
    const court = await courtService.getById(req.params.id);
    return res.status(200).json({ court: court });
  } catch (error) {
    next(error);
  }
}

async function searchCourt(req: Request, res: Response, next: NextFunction) {
  try {
    const key: Partial<ICourt> = req.body;
    const court = await courtService.search(key);
    return res.status(200).json({ court: court });
  } catch (error) {
    next(error);
  }
}

export default {
  createCourt,
  getAllCourt,
  getCourtById,
  searchCourt
};
