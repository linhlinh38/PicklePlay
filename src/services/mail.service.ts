import { mailersend } from '../config/envConfig';
import { IBooking } from '../interfaces/booking.interface';
import { IUser } from '../interfaces/user.interface';
import {
  generateBookingBillContent,
  generateBranchRequestContent
} from '../utils/email';
import { EmailParams, Recipient, Sender } from 'mailersend';
import * as qrcode from 'qrcode';
import * as fs from 'fs';
import bookingModel from '../models/booking.model';
import { IBranch } from '../interfaces/branch.interface';
import { log } from 'console';

export async function sendBookingBillEmail(
  booking: IBooking,
  user: IUser,
  base64QR: string
) {
  try {
    const recipients = [
      new Recipient(user.email, user.firstName + ' ' + user.lastName)
    ];
    const sender = new Sender('linh@trial-v69oxl5ok8dg785k.mlsender.net');
    const bookingData = await bookingModel
      .find({ _id: booking._id })
      .populate('court');
    const body = generateBookingBillContent(bookingData[0], user);
    const emailParams = new EmailParams()
      .setFrom(sender)
      .setTo(recipients)
      .setSubject('Bookminton: Booking Comfirmed')
      .setHtml(body.html)
      .setText(body.text)
      .setAttachments([
        {
          filename: 'BookingQR.png',
          content: base64QR.toString(),
          disposition: 'attachment'
        }
      ]);

    await mailersend.email.send(emailParams);
    return;
  } catch (error) {
    console.error('Error in sendBookingBillEmail:', error);
  }
}

export async function sendBranchResultEmail(branch: IBranch, user: IUser) {
  try {
    const recipients = [
      new Recipient(user.email, user.firstName + ' ' + user.lastName)
    ];
    const sender = new Sender('linh@trial-v69oxl5ok8dg785k.mlsender.net');

    const body = generateBranchRequestContent(branch, user);
    const emailParams = new EmailParams()
      .setFrom(sender)
      .setTo(recipients)
      .setSubject('Bookminton: Result Of Request Create Branch')
      .setHtml(body.html)
      .setText(body.text);

    await mailersend.email.send(emailParams);
    return;
  } catch (error) {
    console.error('Error in sendBranchResultEmail:', error);
  }
}

export interface BookingData {
  redirectUrl: string;
}

export async function generateQrCode(bookingData: BookingData) {
  try {
    // const bookingString = `http://localhost:3000/${bookingData.redirectUrl}`;
    // await qrcode.toFile(outputPath, bookingString, {
    //   errorCorrectionLevel: 'H',
    //   type: 'png'
    // });
    // console.log('QR code generated successfully:', outputPath);
    const bookingString = `http://localhost:3000/${bookingData.redirectUrl}`;

    const qrData = await qrcode.toDataURL(bookingString);

    let base64String;
    if (typeof qrData === 'string') {
      base64String = qrData.replace(/^data:image\/\w+;base64,/, '');
    }

    return base64String ?? '';
  } catch (error) {
    console.error('Error generating QR code:', error);
  }
}
