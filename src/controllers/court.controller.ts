import { NextFunction, Request, Response } from 'express';
import { ICourt } from '../interfaces/court.interface';
import { CourtStatusEnum } from '../utils/enums';
import { courtService } from '../services/court.service';
import { branchService } from '../services/branch.service';

async function createCourt(req: Request, res: Response, next: NextFunction) {
  const newCourt: ICourt = {
    name: req.body.name,
    type: req.body.type,
    price: req.body.price,
    images: req.body.images,
    description: req.body.description,
    status: CourtStatusEnum.PENDING,
    branch: req.body.branch
  };
  try {
    const result = await courtService.create(newCourt);
    if (result._id) {
      const branch = await branchService.getById(result.branch as string);
      branch.courts = [...branch.courts, result];
      await branchService.update(branch._id, {
        courts: branch.courts
      });
    }
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

async function getCourtAvailable(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { slots, date, branch } = req.body;
    const court = await courtService.getCourtAvailable(slots, date, branch);
    return res.status(200).json({ court: court });
  } catch (error) {
    next(error);
  }
}

export default {
  createCourt,
  getAllCourt,
  getCourtById,
  searchCourt,
  getCourtAvailable
};
