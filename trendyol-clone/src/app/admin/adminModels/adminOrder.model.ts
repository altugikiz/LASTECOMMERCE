export interface AdminOrder {
    /** Siparişin benzersiz ID’si */
    id: number;
  
    /** Siparişi veren kullanıcının e-posta adresi */
    userEmail: string;
  
    /** Siparişteki ürün adları */
    productNames: string[];
  
    /** Toplam tutar */
    totalPrice: number;
  
    /** Sipariş tarihi (ISO string olarak) */
    orderDate?: string;
  
    /** Örn: "PENDING", "SHIPPED", "DELIVERED" */
    status?: string;
  }
  