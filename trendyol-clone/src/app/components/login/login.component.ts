import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: false
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  login(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = true;

    if (!this.email || !this.password) {
      this.errorMessage = 'Please enter both email and password';
      this.isLoading = false;
      return;
    }

    this.authService.login(this.email, this.password).subscribe({
      next: ({ token }) => {
        this.authService.saveToken(token);

        // Roller debug
        const roles = this.authService.getUserRoles();
        console.log('User roles after login:', roles);

        // Admin kontrolü: hem "ADMIN" hem "ROLE_ADMIN"
        if (roles.includes('ADMIN') || roles.includes('ROLE_ADMIN')) {
          this.successMessage = 'Login successful! Redirecting to admin panel...';
          console.log('Navigating to /admin/dashboard');
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']).then(success => {
              console.log('Navigation success:', success);
            }).catch(err => {
              console.error('Navigation error:', err);
            });
          }, 1000);

        // Seller kontrolü: hem "SELLER" hem "ROLE_SELLER"
        } else if (roles.includes('SELLER') || roles.includes('ROLE_SELLER')) {
          this.successMessage = 'Login successful! Redirecting to seller dashboard...';
          console.log('Navigating to /seller/dashboard');
          setTimeout(() => {
            this.router.navigate(['/seller/dashboard']).then(success => {
              console.log('Navigation success:', success);
            }).catch(err => {
              console.error('Navigation error:', err);
            });
          }, 1000);

        // Diğer herkes ana sayfaya
        } else {
          this.successMessage = 'Login successful! Redirecting to homepage...';
          console.log('Navigating to /');
          setTimeout(() => {
            this.router.navigate(['/']).then(success => {
              console.log('Navigation success:', success);
            }).catch(err => {
              console.error('Navigation error:', err);
            });
          }, 1000);
        }

        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Invalid email or password';
        console.error('Login error:', err);
      }
    });
  }

  resetForm(): void {
    this.email = '';
    this.password = '';
    this.errorMessage = '';
    this.successMessage = '';
    this.isLoading = false;
  }
}
