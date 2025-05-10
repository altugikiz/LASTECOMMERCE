import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: false
})
export class DashboardComponent implements OnInit {
  dashboardData: any = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.hasRole('ADMIN')) {
      console.warn('User is not an admin, redirecting to login');
      this.authService.logout();
      return;
    }

    this.loadDashboardData();
  }

  loadDashboardData(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'No token found. Please login again.';
      this.authService.logout();
      return;
    }

    this.isLoading = true;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any>('http://localhost:8080/api/admin/dashboard', { headers }).subscribe({
      next: (data) => {
        console.log('Dashboard data loaded:', data);
        this.dashboardData = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load dashboard data: ' + (err.message || 'Unknown error');
        console.error('Error loading dashboard data:', err);
        this.isLoading = false;
        if (err.status === 403) {
          this.authService.logout();
        }
      }
    });
  }
}