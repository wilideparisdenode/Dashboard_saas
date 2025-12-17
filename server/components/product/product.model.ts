import { Schema, model} from 'mongoose';

// Payment schema
const ProductSchema = new Schema(
  {
  
 description:{type: String, required: true},
  stock:{type: Number, required: true},
    name: { type: String, required: true },
    price: { type: Number, required: true },
   
   category: { type: String, required: true },
   imageUrl:{ type: String, required: true }
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);

// Create and export model
export const ProductModel= model('Product',ProductSchema);