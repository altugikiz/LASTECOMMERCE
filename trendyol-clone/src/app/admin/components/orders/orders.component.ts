// src/app/admin/components/orders/orders.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminOrder } from '../../adminModels/adminOrder.model';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: false,
})
export class OrdersComponent implements OnInit {
  orders: AdminOrder[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.error = null;
    this.adminService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('An error occurred while loading products.', err);
        this.error = 'An error occurred while loading products.';
        this.isLoading = false;
      }
    });
  }

  // İsteğe bağlı: sipariş detay sayfasına yönlendirme
  viewOrder(order: AdminOrder): void {
    // Örneğin routerLink kullanarak:
    // this.router.navigate(['/admin/orders', order.id]);
    console.log('For order details refer to:', order.id);
  }
}
