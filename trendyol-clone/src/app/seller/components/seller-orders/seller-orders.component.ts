// src/app/seller/components/seller-orders/seller-orders.component.ts
import { Component, OnInit } from '@angular/core';
import { SellerService } from '../../services/seller.service';
import { SellerOrder } from '../../models/order.model';

@Component({
  selector: 'app-seller-orders',
  templateUrl: './seller-orders.component.html',
  styleUrls: ['./seller-orders.component.scss'],
  standalone: false
})
export class SellerOrdersComponent implements OnInit {
  orders: SellerOrder[] = [];
  loading = false;
  error = '';

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading = true;
    this.error = '';

    this.sellerService.getOrders().subscribe({
      next: data => {
        this.orders = data;
        this.loading = false;
      },
      error: err => {
        console.error(err);
        this.error = 'Could not load orders.';
        this.loading = false;
      }
    });
  }
}
