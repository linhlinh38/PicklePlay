import moment from 'moment';
import { IBooking } from '../interfaces/booking.interface';
import { IUser } from '../interfaces/user.interface';
import { ICourt } from '../interfaces/court.interface';
import { IBranch } from '../interfaces/branch.interface';

export function generateBookingBillContent(
  booking: IBooking,
  customer: IUser
): { html: string; text: string } {
  const court = booking.court as ICourt;
  const htmlContent = `
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 12px 0;
      background-color: #f4f4f4;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
      "
    >
      <div>Dear <span>${customer.firstName + customer.lastName},</span></div>
      <div style="color: #333333; margin-top: 20px;">
        Thank you for choosing <span style="color: #40b59f; font-weight: bold;">Bookminton</span>.
      </div>
      <p style">
        Your booking has been successfully created. Please review the details
        below:
      </p>
      <table style="width: 100%; border-collapse: collapse; margin-top: 20px">
        <thead>
          <tr>
            <th
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #40b59f;
                color: #ffffff;
              "
              colspan="2"
            >
              <div style="display: flex; justify-content: center;">Booking Details</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              Booking Type
            </td>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              ${booking.type}
            </td>
          </tr>
          <tr>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              Court
            </td>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              ${court.name}
            </td>
          </tr>
          <tr>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              Start Date
            </td>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              ${moment(booking.startDate, 'YYYY-MM-DD').format('YYYY-MM-DD')}
            </td>
          </tr>
          <tr>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              End Date
            </td>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              ${moment(booking.endDate, 'YYYY-MM-DD').format('YYYY-MM-DD')}
            </td>
          </tr>
          ${
            booking.totalHour
              ? `
          <tr>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              Total Hours
            </td>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              ${booking.totalHour}
            </td>
          </tr>
          `
              : ''
          }
          <tr>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              Total Price
            </td>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              ${booking.totalPrice}
            </td>
          </tr>
          <tr>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              Payment Method
            </td>
            <td
              style="
                border: 1px solid #2DD4BF;
                padding: 10px;
                text-align: left;
                background-color: #eff7f8;
              "
            >
              ${booking.paymentMethod}
            </td>
          </tr>
        </tbody>
      </table>
      <p style="color: #555555">
        <strong>Note: Please arrive at least 15 minutes early for your booking and show QR (attachment) to check-in.</strong>
      </p>
      <p style="color: #555555">
        <strong>Cancellation Policy:</strong> Bookings can be cancelled up to 2
        days before the scheduled date. Cancellations made within 2 days of the
        booking will result in the forfeiture of your deposit.
      </p>
      <p style="color: #555555">
        Thank you for your business! We hope you enjoy your booking.
      </p>
      <p style="color: #555555">
        <div>Sincerely,</div>
        <div>--</div>
      </p>
      <div style="margin-top: 20px; color: #777777">
        <div style="background-color: #f9f9f9; border-radius: 5px">
          <div
            style="
              font-weight: bold;
              margin-bottom: 10px;
              color: #4d4d4d;
            "
          >
            Bookminton
          </div>
          <div style="margin-bottom: 10px">
            <p style="margin: 5px 0">
              Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí
              Minh, Vietnam
            </p>
            <div style="display: flex; gap: 20px">
              <p style="margin: 5px 0">
                <span style="font-weight: bold; color: #2dd4bf">M:</span>
                <a
                  href="tel:+84846771103"
                  style="color: #0066cc; text-decoration: none"
                  >(+84) 84 677 1103</a
                >
              </p>
              <p style="margin: 5px 0">
                <span style="font-weight: bold; color: #2dd4bf">E:</span>
                <a
                  href="mailto:linh@trial-v69oxl5ok8dg785k.mlsender.net"
                  style="color: #0066cc; text-decoration: none"
                  >linh@trial-v69oxl5ok8dg785k.mlsender.net</a
                >
              </p>
            </div>
            <p style="margin: 5px 0">
              <span style="font-weight: bold; color: #2dd4bf">Website:</span>
              <a
                href="http://www.bookminton.com.vn"
                target="_blank"
                style="color: #0066cc; text-decoration: none"
                >www.bookminton.com.vn</a
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </body>
  `;

  const textContent = `
    Thank you for choosing Bookminton, ${customer.firstName + customer.lastName}!

    Your booking has been successfully created. Please review the details below:

    Booking Type: ${booking.type}
    Court: ${court.name}
    Start Date: ${moment(booking.startDate, 'YYYY-MM-DD')}
    End Date: ${moment(booking.endDate, 'YYYY-MM-DD')}
    ${booking.totalHour ? `Total Hours: ${booking.totalHour}\n` : ''}
    Total Price: ${booking.totalPrice}
    Payment Method: ${booking.paymentMethod}

    Please arrive at least 15 minutes early for your booking.

    Cancellation Policy: Bookings can be cancelled up to 2 days before the scheduled date.`;
  return { html: htmlContent, text: textContent };
}

export function generateBranchRequestContent(
  branch: IBranch,
  manager: IUser
): { html: string; text: string } {
  const htmlContent = `
<body
  style="
    font-family: Arial, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 12px 0;
    background-color: #f4f4f4;
  "
>
  <div
    style="
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    "
  >
    <p>Dear ${manager.firstName + manager.lastName},</p>
    <p>
      This email is to inform you about
      the status of your request to create a new branch of
      <span style="color: #40b59f; font-weight: bold">Bookminton</span>. After
      careful consideration and review, I am pleased to inform you that your
      request has been <strong>${branch.status}</strong>.
    </p>
    <div style="color: #333333; margin-top: 20px; font-size: 16px">
      <p><strong>Details information:</strong></p>
      <p><strong>Branch Name:</strong> ${branch.name}</p>
      <p><strong>Address:</strong> ${branch.address}</p>
    </div>
    <p>
      Should you have any questions or require further assistance regarding
      this matter, please do not hesitate to reach out to me or the concerned
      department.
    </p>
    <p>
      Thank you for your initiative and dedication to expanding
      <span style="color: #40b59f; font-weight: bold">Bookminton</span>
      operations. We look forward to the successful establishment of the new
      branch.
    </p>
    <div style="margin-top: 20px; color: #777777; font-size: 14px">
      <p style="color: #333333">Best regards,</p>
      <div>--</div>
    </div>
    <div style="margin-top: 20px; color: #777777; font-size: 14px">
      <div style="background-color: #f9f9f9; border-radius: 5px">
        <div
          style="
            font-size: large;
            font-weight: bold;
            margin-bottom: 10px;
            color: #4d4d4d;
          "
        >
          Bookminton
        </div>
        <div style="margin-bottom: 10px">
          <p style="margin: 5px 0">
            Lô E2a-7, Đường D1, Đ. D1, Long Thạnh Mỹ, Thành Phố Thủ Đức, Hồ Chí
            Minh, Vietnam
          </p>
          <div style="display: flex; gap: 20px">
            <p style="margin: 5px 0">
              <span style="font-weight: bold; color: #2dd4bf">M:</span>
              <a
                href="tel:+84846771103"
                style="color: #0066cc; text-decoration: none"
                >(+84) 84 677 1103</a
              >
            </p>
            <p style="margin: 5px 0">
              <span style="font-weight: bold; color: #2dd4bf">E:</span>
              <a
                href="mailto:linh@trial-v69oxl5ok8dg785k.mlsender.net"
                style="color: #0066cc; text-decoration: none"
                >linh@trial-v69oxl5ok8dg785k.mlsender.net</a
              >
            </p>
          </div>
          <p style="margin: 5px 0">
            <span style="font-weight: bold; color: #2dd4bf">Website:</span>
            <a
              href="http://www.bookminton.com.vn"
              target="_blank"
              style="color: #0066cc; text-decoration: none"
              >www.bookminton.com.vn</a
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</body>
`;

  const textContent = `
    Thank you for choosing Bookminton`;
  return { html: htmlContent, text: textContent };
}
