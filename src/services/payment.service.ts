import { config } from '../config/envConfig';
import querystring from 'qs';
import crypto from 'crypto';
import { BaseService } from './base.service';
import { IPayment } from '../interfaces/payment.interface';
import paymentModel from '../models/payment.model';
import { BadRequestError } from '../errors/badRequestError';
import { IBuyPackage } from '../interfaces/buyPackage.interface';
import { IPackageCourt } from '../interfaces/packageCourt.interface';
import { packageCourtService } from './packageCourt.service';
import { NotFoundError } from '../errors/notFound';
import { managerService } from './manager.service';
import { PackageCourtTypeEnum } from '../utils/enums';
import { payos } from '../utils/payos';
import { getRandomNumber } from '../utils/util';
import PayOS from '@payos/node';

export default class PaymentService extends BaseService<IPayment> {
  async deletePayment(id: string) {
    await paymentService.delete;
  }
  constructor() {
    super(paymentModel);
  }

  async getMyPayments(userId: string) {
    const payments = await paymentModel.find({ owner: userId });
    return payments;
  }

  async getPaymentUrl(
    amount: number,
    description: string,
    returnUrl: string,
    cancelUrl: string,
    keyData?: { apiKey: string; clientId: string; checksumKey: string }
  ) {
    const orderCode = await getRandomNumber();
    // const cancelUrl = config.PAYOS_CANCEL_URL;
    // const returnUrl = config.PAYOS_RETURN_URL;
    if (!keyData)
      return {
        orderCode,
        url: (
          await payos.createPaymentLink({
            orderCode,
            cancelUrl: cancelUrl ? cancelUrl : config.PAYOS_CANCEL_URL,
            returnUrl: returnUrl ? returnUrl : config.PAYOS_RETURN_URL,
            amount,
            description
          })
        ).checkoutUrl
      };
    const payosForShop = new PayOS(
      keyData.clientId,
      keyData.apiKey,
      keyData.checksumKey
    );
    return {
      orderCode,
      url: (
        await payosForShop.createPaymentLink({
          orderCode,
          cancelUrl,
          returnUrl,
          amount,
          description
        })
      ).checkoutUrl
    };
  }

  async getTotalAmount(buyPackageDTO: Partial<IBuyPackage>) {
    const packageCourt: IPackageCourt = await packageCourtService.getById(
      buyPackageDTO.packageId
    );
    if (!packageCourt) throw new NotFoundError('Package not found');
    const manager = await managerService.getById(buyPackageDTO.managerId);
    if (!manager) throw new NotFoundError('Manager not found');

    if (packageCourt.type == PackageCourtTypeEnum.CUSTOM) {
      if (packageCourt.maxCourt > 20)
        throw new BadRequestError(
          'Custom package can only be bought for maximum 20 courts'
        );
    }

    const currentDate = new Date();
    if (manager.expiredDate && manager.expiredDate > currentDate) {
      throw new BadRequestError(
        'You cannot purchase a new court package as your current package is still active'
      );
    }

    const totalPrice =
      packageCourt.totalPrice ||
      packageCourt.priceEachCourt * buyPackageDTO.totalCourt;
    return totalPrice;
  }

  async addPayment(paymentDTO: IPayment) {
    const paymentExist = await paymentModel.findOne({
      accountNumber: paymentDTO.accountNumber,
      accountName: paymentDTO.accountName,
      accountBank: paymentDTO.accountBank,
      owner: paymentDTO.owner
    });
    if (paymentExist) throw new BadRequestError('This payment already exist');

    await paymentModel.create(paymentDTO);
  }

  async createPaymentUrl(buyPackageDTO: Partial<IBuyPackage>) {
    const amount = await this.getTotalAmount(buyPackageDTO);
    return await this.getPaymentUrl(
      amount,
      buyPackageDTO.description,
      buyPackageDTO.returnUrl,
      buyPackageDTO.cancelUrl
    );
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
