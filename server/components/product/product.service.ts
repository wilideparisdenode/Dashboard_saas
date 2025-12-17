
import type { Product, UpdateProductDTO } from './product.dto';
import {ProductModel} from "./product.model"
import { Types } from 'mongoose';

class ProductService {
 
async createProduct(data: Product): Promise<Product> { const product: Product = { ...data, }; const P=new ProductModel(product); await P.save(); 
return P.toObject(); }
  async getAllProducts(): Promise<Product[]> {
    return await ProductModel.find();
  }
  


 async getProductById(id: string): Promise<Product | null> {
  return await ProductModel.findById(new Types.ObjectId(id));
}

async updateProduct(id: string, data: UpdateProductDTO): Promise<Product | null> {
  return await ProductModel.findByIdAndUpdate(
    new Types.ObjectId(id),
    data,
    { new: true, lean: true }
  );
}

async deleteProduct(id: string): Promise<boolean> {
  const deleted = await ProductModel.findByIdAndDelete(new Types.ObjectId(id));
  return !!deleted;
}

async updateStock(id: string, quantity: number): Promise<Product | null> {
  return ProductModel.findByIdAndUpdate(
    new Types.ObjectId(id),
    { $inc: { stock: -quantity } },
    { new: true, lean: true }
  );
}
}

export default new ProductService();