import { Model } from "mongoose";
import { ICRUDService } from "../utils/ICRUDService";
import { DatabaseError, ServerError } from "../utils/error";

export abstract class BaseService<T> implements ICRUDService<T> {
  public readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: T): Promise<T> {
    const newDocument = new this.model(data);
    try {
      await newDocument.save();
      return newDocument;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw new ServerError("Validation error: " + error.message);
      } else {
        throw new DatabaseError("Database error: " + error.message);
      }
    }
  }

  async search(key?: Partial<T>): Promise<T[] | null> {
    try {
      return await this.model.find(key);
    } catch (error: any) {
      throw new DatabaseError("Database error: " + error.message);
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id);
    } catch (error: any) {
      throw new DatabaseError("Database error: " + error.message);
    }
  }

  async getAll(): Promise<T[] | null> {
    try {
      return await this.model.find();
    } catch (error: any) {
      throw new DatabaseError("Database error: " + error.message);
    }
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    try {
      const document = await this.model.findById(id);

      if (!document) {
        throw new Error(`Record not found`);
      }

      Object.assign(document, data);
      await document.save();
      return document;
    } catch (error: any) {
      if (error.name === "ValidationError") {
        throw new ServerError("Validation error: " + error.message);
      } else {
        throw new DatabaseError("Database error: " + error.message);
      }
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.model.findByIdAndDelete(id);
    } catch (error: any) {
      throw new DatabaseError("Database error: " + error.message);
    }
  }
}
