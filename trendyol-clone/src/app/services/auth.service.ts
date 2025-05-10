// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';

interface JWTPayload {
  sub?: string;
  exp?: number;
  roles?: string[];
  authorities?: string[];
  id?: string | number;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private baseUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) {}

  register(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    sellerRequested: boolean
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/register`, {
      email, password, firstName, lastName, sellerRequested
    });
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.token) {
            this.saveToken(response.token);
            console.log('Token saved:', this.getToken());
            console.log('Decoded payload:', this.decodeToken(response.token));
            console.log('Roles after login:', this.getUserRoles());
          }
        })
      );
  }

  private decodeToken(token: string): JWTPayload {
    try {
      return jwtDecode<JWTPayload>(token);
    } catch {
      return {};
    }
  }

  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    const payload = this.decodeToken(token);
    if (payload.exp && payload.exp * 1000 < Date.now()) {
      console.warn('Token expired');
      this.logout();
      return null;
    }
    return token;
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getEmailFromToken(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodeToken(token);
    return payload.sub ?? null;
  }

  getUserRoles(): string[] {
    const token = this.getToken();
    if (!token) return [];
    const payload = this.decodeToken(token);
    // roles veya authorities altında rolle olabilir:
    return payload.roles
      ?? (Array.isArray(payload.authorities) ? payload.authorities : [])
      ?? [];
  }

  hasRole(role: string): boolean {
    return this.getUserRoles().includes(role) || this.getUserRoles().includes(`ROLE_${role}`);
  }

  getUserId(): string | null {
    const token = this.getToken();
    if (!token) return null;
    const payload = this.decodeToken(token);
    return payload.id?.toString() ?? payload.sub ?? null;
  }
}
