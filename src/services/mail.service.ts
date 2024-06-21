import { mailersend } from '../config/envConfig';
import { IBooking } from '../interfaces/booking.interface';
import { IUser } from '../interfaces/user.interface';
import { generateBookingBillContent } from '../utils/email';
import { EmailParams, Recipient, Sender } from 'mailersend';

export async function sendBookingBillEmail(booking: IBooking, user: IUser) {
  try {
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
    return;
  } catch (error) {
    console.error('Error in sendBookingBillEmail:', error);
  }
}
