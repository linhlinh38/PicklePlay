import mongoose, { Model } from 'mongoose';
import { ICRUDService } from '../utils/ICRUDService';
import { BadRequestError } from '../errors/badRequestError';

export abstract class BaseService<T> implements ICRUDService<T> {
  public readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async beforeCreate(data: T): Promise<void> {}
  async beforeUpdate(id: string, data: Partial<T>): Promise<void> {}

  async create(data: T): Promise<T> {
    await this.beforeCreate(data);
    const newDocument = new this.model(data);
    await newDocument.save();
    return newDocument;
  }

  async search(key?: Partial<T>): Promise<T[] | null> {
    return await this.model.find(key);
  }

  async getById(id: string): Promise<T | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Data not found');
    }
    return await this.model.findById(id);
  }

  async getAll(): Promise<T[] | null> {
    return await this.model.find();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Data not found');
    }
    this.beforeUpdate(id, data);
    const document = await this.model.findById(id);

    if (!document) {
      throw new Error(`Record not found`);
    }

    Object.assign(document, data);
    await document.save();
    return document;
  }

  async delete(id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestError('Data not found');
    }
    await this.model.findByIdAndDelete(id);
  }
}
