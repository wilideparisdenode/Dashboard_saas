import { Request, Response, NextFunction } from 'express';
import productService from './product.service';

export const createProduct = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const product = await productService.createProduct(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const getAllProducts = async (_req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) :Promise<void>=> {
  try {
    const product = await productService.getProductById(req.params.id);
    if (!product) {
       res.status(404).json({ success: false, message: 'Product not found' });
       return
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    if (!product) {
       res.status(404).json({ success: false, message: 'Product not found' });
       return
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction):Promise<void> => {
  try {
    const deleted = await productService.deleteProduct(req.params.id);
    if (!deleted) {
       res.status(404).json({ success: false, message: 'Product not found' });
       return;
    }
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};
