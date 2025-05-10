// src/app/admin/services/dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface DashboardSummary {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  // environment yerine sabit olarak base URL
  private readonly summaryUrl = '/api/admin/dashboard/summary';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(this.summaryUrl).pipe(
      tap(data => console.debug('Dashboard data:', data)),
      catchError(err => {
        console.error('Dashboard fetch error', err);
        return throwError(() => err);
      })
    );
  }
}
