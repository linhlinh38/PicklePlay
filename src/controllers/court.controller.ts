import { NextFunction, Request, Response } from 'express';
import { ICourt } from '../interfaces/court.interface';
import { CourtStatusEnum } from '../utils/enums';
import { courtService } from '../services/court.service';
import { branchService } from '../services/branch.service';
import { AuthRequest } from '../middlewares/authentication';

async function createCourt(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const newCourt: ICourt = {
    name: req.body.name,
    type: req.body.type,
    price: req.body.price,
    images: req.body.images,
    description: req.body.description,
    status: CourtStatusEnum.INUSE,
    branch: req.body.branch
  };
  try {
    const branch = await branchService.getById(newCourt.branch as string);
    if (branch.manager.toString() !== req.loginUser) {
      return res.status(401).json({
        message: 'User not have credential to create court on this branch'
      });
    }
    const result = await courtService.create(newCourt);
    if (result._id) {
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

async function updateCourt(req: Request, res: Response, next: NextFunction) {
  const updateCourtData: Partial<ICourt> = req.body;
  const id = req.params.id;
  try {
    const updateResult = await courtService.update(id, updateCourtData);
    if (updateResult._id) {
      return res
        .status(201)
        .json({ message: 'Update Court Successfully', data: updateResult });
    }
    return res.status(400).json({ message: 'Update Court Failed' });
  } catch (error) {
    next(error);
  }
}

async function updateCourtStatus(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const updateCourtData: Partial<ICourt> = {
    status: req.body.status
  };
  const id = req.params.id;
  try {
    const updateResult = await courtService.update(id, updateCourtData);
    if (updateResult._id) {
      return res
        .status(201)
        .json({ message: 'Update Court Successfully', data: updateResult });
    }
    return res.status(400).json({ message: 'Update Court Failed' });
  } catch (error) {
    next(error);
  }
}

async function getAllCourt(req: Request, res: Response) {
  const court = await courtService.getAll();
  return res
    .status(200)
    .json({ message: 'Get Court Successfully', data: court });
}

async function getCourtById(req: Request, res: Response, next: NextFunction) {
  try {
    const court = await courtService.getById(req.params.id);
    return res
      .status(200)
      .json({ message: 'Get Court Successfully', data: court });
  } catch (error) {
    next(error);
  }
}

async function searchCourt(req: Request, res: Response, next: NextFunction) {
  try {
    const key: Partial<ICourt> = req.body;
    const court = await courtService.search(key);
    return res
      .status(200)
      .json({ message: 'Search Court Successfully', data: court });
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
    return res
      .status(200)
      .json({ message: 'Get Court Successfully', data: court });
  } catch (error) {
    next(error);
  }
}

async function deleteCourt(req: Request, res: Response, next: NextFunction) {
  const id: string = req.params.id;
  try {
    await courtService.update(id, { status: CourtStatusEnum.TERMINATION });
    return res.status(200).json({
      message: 'Delete court success'
    });
  } catch (error) {
    next(error);
  }
}

async function getMyAvailableCourts(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    return res
      .status(200)
      .json({ data: await courtService.getMyAvailableCourts(req.loginUser) });
  } catch (error) {
    next(error);
  }
}

async function getAllCourtsOfManager(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    return res.status(200).json({
      message: 'Get all courts of manager success',
      data: await courtService.getAllCourtsOfManager(req.params.id)
    });
  } catch (error) {
    next(error);
  }
}

export default {
  createCourt,
  getAllCourt,
  getCourtById,
  searchCourt,
  getCourtAvailable,
  getMyAvailableCourts,
  updateCourt,
  updateCourtStatus,
  deleteCourt,
  getAllCourtsOfManager
};
