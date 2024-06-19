import { mailersend } from '../config/envConfig';
import { IBooking } from '../interfaces/booking.interface';
import { IUser } from '../interfaces/user.interface';
import { generateBookingBillContent } from '../utils/email';
import { EmailParams, Recipient, Sender } from 'mailersend';
import { Request, Response, NextFunction } from 'express';

export async function sendBookingBillEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const booking = req.body.booking;
    const user = req.body.user;
    const recipients = [
      new Recipient(user.email, user.firstName + ' ' + user.lastName)
    ];
    const sender = new Sender('linh@trial-v69oxl5ok8dg785k.mlsender.net');
    const body = generateBookingBillContent(booking, user);
    const emailParams = new EmailParams()
      .setFrom(sender)
      .setTo(recipients)
      .setSubject('Bookminton: Booking Comfirmed')
      .setHtml(body.html)
      .setText(body.text);

    await mailersend.email.send(emailParams);
    res.status(200).json({
      message: 'Send mail success'
    });
  } catch (error) {
    console.error('Error in sendBookingBillEmail:', error);
    next(error);
  }
}
