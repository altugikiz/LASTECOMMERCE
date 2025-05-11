// src/app/core/interceptors/auth.interceptor.ts
import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpHandler, HttpInterceptor, HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Auth API'lerini atla
    if (req.url.includes('/api/auth/')) {
  return next.handle(req);
}

    const token = this.authService.getToken();
    // Her isteğe application/json ekleyelim
    const headersConfig: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headersConfig['Authorization'] = `Bearer ${token}`;
    }

    const cloned = req.clone({
      setHeaders: headersConfig
    });
    return next.handle(cloned);
  }
}
