import moment from 'moment';
import { IBooking } from '../interfaces/booking.interface';
import { IUser } from '../interfaces/user.interface';

export function generateBookingBillContent(
  booking: IBooking,
  customer: IUser
): { html: string; text: string } {
  const htmlContent = `
    <div style="font-family: sans-serif; line-height: 1.5;">
      <h1>Thank you for choosing Bookminton, <span class="math-inline">\{customer\.name\}\!</h1\>
<p\>Your booking has been successfully created\. Please review the details below\:</p\>
<table style\="border\-collapse\: collapse; width\: 100%;"\>
<thead\>
<tr\>
<th style\="border\: 1px solid \#ddd; padding\: 8px;"\>Booking Details</th\>
<th style\="border\: 1px solid \#ddd; padding\: 8px;"\></th\>
</tr\>
</thead\>
<tbody\>
<tr\>
<td style\="border\: 1px solid \#ddd; padding\: 8px;"\>Booking Type</td\>
<td style\="border\: 1px solid \#ddd; padding\: 8px;"\></span>${booking.type}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Court</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><span class="math-inline">${booking.court}</td>
</tr\>
<tr\>
<td style\="border\: 1px solid \#ddd; padding\: 8px;"\>Start Date</td\>
<td style\="border\: 1px solid \#ddd; padding\: 8px;"\></span>${booking.startDate}</td>
          </tr>
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">End Date</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${booking.endDate}</td>
          </tr>
          ${
            booking.totalHour
              ? `<tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Total Hours</td>
            <td style="border: 1px solid #ddd; padding: 8px;">${booking.totalHour}</td>
          </tr>`
              : ''
          }
          <tr>
            <td style="border: 1px solid #ddd; padding: 8px;">Total Price</td>
            <td style="border: 1px solid #ddd; padding: 8px;"><span class="math-inline">${booking.totalPrice}</td\>
</tr\>
<tr\>
<td style\="border\: 1px solid \#ddd; padding\: 8px;"\>Payment Method</td\>
<td style\="border\: 1px solid \#ddd; padding\: 8px;"\></span>{paymentMethod}</td>
          </tr>
        </tbody>
      </table>
      <p><strong>Please arrive at least 15 minutes early for your booking.</strong></p>
      <p><strong>Cancellation Policy:** Bookings can be cancelled up to 2 days before the scheduled date. Cancellations made within 2 days of the booking will result in the forfeiture of your deposit.</p>
      <p>Thank you for your business! We hope you enjoy your booking.</p>
      <p>Sincerely,</p>
      <p>The Bookminton Team</p>
    </div>
  `;

  // 5. Generate Plain Text Content
  const textContent = `
    Thank you for choosing Bookminton, ${customer.firstName + customer.lastName}!

    Your booking has been successfully created. Please review the details below:

    Booking Type: ${booking.type}
    Court: ${booking.court}
    Start Date: ${booking.startDate}}
    End Date: ${booking.endDate}}
    ${booking.totalHour ? `Total Hours: ${booking.totalHour}\n` : ''}
    Total Price: ${booking.totalPrice}
    Payment Method: ${booking.paymentMethod}

    Please arrive at least 15 minutes early for your booking.

    Cancellation Policy: Bookings can be cancelled up to 2 days before the scheduled date.`;
  return { html: htmlContent, text: textContent };
}
