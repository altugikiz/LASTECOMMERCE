export interface SellerOrder {
    id:          number;
    orderDate:   string;   // ISO string, pipe date ile format edin
    orderStatus: string;
    totalPrice: number;
  }
  