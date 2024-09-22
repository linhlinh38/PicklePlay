import { ICart } from '../interfaces/cart.interface';
import cardModel from '../models/card.model';
import { BaseService } from './base.service';

class CardService extends BaseService<ICart> {
  constructor() {
    super(cardModel);
  }
}

export const cardService = new CardService();
