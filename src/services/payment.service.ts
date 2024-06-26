import moment from 'moment';
import { config } from '../config/envConfig';
import querystring from 'qs';
import crypto from 'crypto';
import { BaseService } from './base.service';
import { IPayment } from '../interfaces/payment.interface';
import paymentModel from '../models/payment.model';
import { userService } from './user.service';
import { NotFoundError } from '../errors/notFound';
import { BadRequestError } from '../errors/badRequestError';

export default class PaymentService extends BaseService<IPayment> {
  async addPayment(paymentDTO: IPayment) {
    const user = await userService.getById(paymentDTO.user);
    if (!user) throw new NotFoundError('User not found');

    const paymentExist = await paymentModel.findOne({
      accountNumber: paymentDTO.accountNumber,
      accountName: paymentDTO.accountName,
      accountBank: paymentDTO.accountBank,
      owner: user._id
    });
    if (paymentExist) throw new BadRequestError('This payment already exist');

    await paymentModel.create(paymentDTO);
  }
  constructor() {
    super(paymentModel);
  }
  createPaymentUrl(amount: number, returnUrl: string, bookingId?: string) {
    const currentDate = new Date();
    const createDate = moment(currentDate).format('YYYYMMDDHHmmss');

    const tmnCode = config.VNP.TMN_CODE;
    const secretKey = config.VNP.HASH_SECRET;
    let vnpUrl = config.VNP.URL;
    const bankCode = 'VNBANK';
    const locale = 'vn';
    const currCode = 'VND';

    let vnp_Params = {};
    vnp_Params['vnp_Version'] = '2.1.0';
    vnp_Params['vnp_Command'] = 'pay';
    vnp_Params['vnp_TmnCode'] = tmnCode;
    vnp_Params['vnp_Locale'] = locale;
    vnp_Params['vnp_CurrCode'] = currCode;
    vnp_Params['vnp_TxnRef'] = bookingId;
    vnp_Params['vnp_OrderInfo'] = bookingId;
    vnp_Params['vnp_OrderType'] = 'other';
    vnp_Params['vnp_Amount'] = amount * 100;
    vnp_Params['vnp_ReturnUrl'] = returnUrl;
    vnp_Params['vnp_IpAddr'] = '123';
    vnp_Params['vnp_CreateDate'] = createDate;
    vnp_Params['vnp_BankCode'] = bankCode;

    vnp_Params = this.sortObject(vnp_Params);

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

    return vnpUrl;
  }

  verifySuccessUrl(url: string) {
    const queryString = url.split('?')[1];
    const params = new URLSearchParams(queryString);
    let vnp_Params = {};

    for (const [key, value] of params.entries()) {
      vnp_Params[key] = value;
    }

    const secureHash = vnp_Params['vnp_SecureHash'];

    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = this.sortObject(vnp_Params);

    const secretKey = config.VNP.HASH_SECRET;

    const signData = querystring.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac('sha512', secretKey);
    const signed = hmac.update(new Buffer(signData, 'utf-8')).digest('hex');

    return secureHash === signed;
  }

  sortObject(obj) {
    const sorted = {};
    const str = [];
    let key;
    for (key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        str.push(encodeURIComponent(key));
      }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
      sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, '+');
    }
    return sorted;
  }
}

export const paymentService = new PaymentService();
