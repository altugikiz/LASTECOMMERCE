import { Component, OnInit } from '@angular/core';
import { DashboardService, DashboardSummary } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  summary: DashboardSummary | null = null;
  error: string | null = null;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.getSummary().subscribe({
      next: data => this.summary = data,
      error: err => {
        console.error('Error loading Dashboard:', err);
        this.error = 'An error occurred while loading data.';
      }
    });
  }
}
