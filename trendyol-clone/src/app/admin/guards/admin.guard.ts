import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const token = this.auth.getToken();
    console.log('Token in AdminGuard:', token); // Debug
    if (!token) {
      console.log('No token, redirecting to login');
      return this.router.parseUrl('/login');
    }
  
    try {
      const decoded: any = jwtDecode(token);
      const roles: string[] = Array.isArray(decoded.roles) ? decoded.roles : [];
      console.log('Decoded Roles in AdminGuard:', roles); // Debug
      if (roles.includes('ROLE_ADMIN')) {
        return true;
      } else {
        console.log('ROLE_ADMIN not found, redirecting to login');
        return this.router.parseUrl('/login');
      }
    } catch (err) {
      console.error('Token decode error in AdminGuard:', err);
      return this.router.parseUrl('/login');
    }
  }
}