// src/app/seller/components/seller-dashboard/seller-dashboard.component.ts
import { Component, OnInit }   from '@angular/core';
import { SellerService }       from '../../services/seller.service';
import { DashboardData }       from '../../models/dashboard.model';

@Component({
  selector: 'app-seller-dashboard',
  templateUrl: './seller-dashboard.component.html',
  styleUrls: ['./seller-dashboard.component.scss'],
  standalone: false
})
export class SellerDashboardComponent implements OnInit {
  sellerName = '';
  stats = {
    totalProducts: 0,
    pendingOrders: 0,
    monthlyRevenue: 0
  };

  constructor(private sellerService: SellerService) {}

  ngOnInit(): void {
    this.loadStats();
  }

  private loadStats() {
    this.sellerService.getDashboard()
      .subscribe((data: DashboardData) => {
        // now TypeScript knows exactly what you’re getting back
        this.sellerName      = data.sellerName;
        this.stats.totalProducts   = data.totalProducts;
        this.stats.pendingOrders   = data.pendingOrders;
        this.stats.monthlyRevenue  = data.monthlyRevenue;
      });
  }
}
