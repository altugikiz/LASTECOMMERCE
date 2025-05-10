// src/app/seller/models/product.model.ts
export interface SellerProduct {
  id?: number;            // create’da opsiyonel
  name: string;
  description: string;    // artık zorunlu
  price: number;
  stock: number;
  category: string;       // ← ekleyin
  isActive: boolean;      // ← ekleyin (true olarak gönderin)
  imageUrl?: string;      // eğer formunuz destekliyorsa
}
