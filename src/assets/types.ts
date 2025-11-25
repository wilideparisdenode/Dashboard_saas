 export type Product = {
id: number;                     // Unique product identifier
name: string;                   // Product name
category: string;  
quantity?:number;             // Product category
price: number;                  // Price in USD (or local currency)
inStock: boolean;               // Availability
rating?: number;                // Optional rating (1-5)
description?: string;           // Optional detailed description
tags?: string[];                // Optional array of tags/keywords
createdAt?: Date;               // Optional creation date
updatedAt?: Date;               // Optional last update date
};
