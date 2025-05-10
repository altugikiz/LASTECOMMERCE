import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-seller-requests',
  templateUrl: './seller-requests.component.html',
  styleUrls: ['./seller-requests.component.scss']
})
export class SellerRequestsComponent implements OnInit {
  sellerRequests: any[] = [];
  errorMessage: string = '';
  isLoading: boolean = false; // Loading göstergesi için

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private cdr: ChangeDetectorRef // Değişim algılama için
  ) {}

  ngOnInit(): void {
    this.loadSellerRequests();
  }

  loadSellerRequests(): void {
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'No token found. Please login again.';
      return;
    }

    this.isLoading = true; // Loading başlıyor
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.get<any[]>('http://localhost:8080/api/admin/users/seller-requests', { headers }).subscribe({
      next: (data) => {
        this.sellerRequests = data;
        this.isLoading = false; // Loading bitti
        console.log('Seller requests loaded:', data);
        this.cdr.detectChanges(); // Değişim algılamayı manuel tetikle
      },
      error: (err) => {
        this.errorMessage = 'Failed to load seller requests';
        this.isLoading = false;
        console.error('Error loading seller requests:', err);
        this.cdr.detectChanges();
      }
    });
  }

  approveSeller(userId: number): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    this.isLoading = true; // Loading başlıyor
    this.http.post(`http://localhost:8080/api/admin/users/seller-requests/${userId}/approve`, {}, { headers }).subscribe({
      next: () => {
        console.log('Seller approved:', userId);
        this.loadSellerRequests(); // Listeyi yeniden yükle
      },
      error: (err) => {
        console.error('Error approving seller:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  rejectSeller(userId: number): void {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    this.isLoading = true; // Loading başlıyor
    this.http.post(`http://localhost:8080/api/admin/users/seller-requests/${userId}/reject`, {}, { headers }).subscribe({
      next: () => {
        console.log('Seller rejected:', userId);
        this.loadSellerRequests();
      },
      error: (err) => {
        console.error('Error rejecting seller:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  trackById(index: number, request: any): number {
    return request.id;
  }
}