import { NextFunction, Request, Response } from 'express';
import { DatabaseError, ServerError } from '../utils/error';
import { customerService } from '../services/customer.service';

async function createCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const customer = req.body;
    console.log(customer, 'customer');
    
    customer.password = customerService.encryptedPassword(req.body.password);
    await customerService.create(customer);
    return res.status(201).json({ message: 'Created User Successfully' });
  } catch (error: any) {
    if (error instanceof ServerError) {
      return res.status(500).json({ message: error.message });
    } else if (error instanceof DatabaseError) {
      return res.status(503).json({ message: error.message });
    } else {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  }
}

export default {
  createCustomer,
};
