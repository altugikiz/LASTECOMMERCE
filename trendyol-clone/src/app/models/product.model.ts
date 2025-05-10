// src/app/models/product.model.ts

import { Review } from "./review.model";

export interface Product {
  id: number;
  sellerId?: number;
  name: string;
  brand?: string;
  gender?: string;
  category: string;           // artık kesin var
  description: string;        // artık kesin var
  price: number;
  imageUrl?: string;
  image?: string;  //donradan klendi
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;


  categoryId: number;
  categoryName: string;

  reviews?: any[];
  avgRating?: number;

}
