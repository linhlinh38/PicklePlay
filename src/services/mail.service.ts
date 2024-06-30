import { mailersend } from '../config/envConfig';
import { IBooking } from '../interfaces/booking.interface';
import { IUser } from '../interfaces/user.interface';
import { generateBookingBillContent } from '../utils/email';
import { EmailParams, Recipient, Sender } from 'mailersend';
import * as qrcode from 'qrcode';

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
    // .setAttachments();

    await mailersend.email.send(emailParams);
    return;
  } catch (error) {
    console.error('Error in sendBookingBillEmail:', error);
  }
}

export interface BookingData {
  customer: string;
  email: string;
  bookingId: string;
  type: string;
}

export async function generateQrCode(
  bookingData: BookingData,
  outputPath: string
) {
  try {
    const bookingString = JSON.stringify(bookingData);
    await qrcode.toFile(outputPath, bookingString, {
      errorCorrectionLevel: 'H',
      type: 'png'
    });
    console.log('QR code generated successfully:', outputPath);
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
}
