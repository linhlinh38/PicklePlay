import { Model } from 'mongoose';
import { ICRUDService } from '../utils/ICRUDService';

export abstract class BaseService<T> implements ICRUDService<T> {
  public readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: T): Promise<T> {
    const newDocument = new this.model(data);
    await newDocument.save();
    return newDocument;
  }

  async search(key?: Partial<T>): Promise<T[] | null> {
    return await this.model.find(key);
  }

  async getById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async getAll(): Promise<T[] | null> {
    return await this.model.find();
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const document = await this.model.findById(id);

    if (!document) {
      throw new Error(`Record not found`);
    }

    Object.assign(document, data);
    await document.save();
    return document;
  }

  async delete(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}
