import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
 
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: false
})
export class RegisterComponent {
  email = '';
  password = '';
  firstName = '';
  lastName = '';
  sellerRequested = false;
 
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;
 
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}
 
  register(): void {
    if (
      !this.email.trim() ||
      !this.password.trim() ||
      !this.firstName.trim() ||
      !this.lastName.trim()
    ) {
      this.errorMessage = 'All fields are required.';
      return;
    }
 
    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';
 
    this.authService
      .register(
        this.email,
        this.password,
        this.firstName,
        this.lastName,
        this.sellerRequested
      )
      .subscribe({
        next: () => {
          this.successMessage = this.sellerRequested
            ? 'Seller request submitted! Please login and wait for admin approval.'
            : 'Registration successful! Please login.';
          this.isSubmitting = false;
          setTimeout(() => this.router.navigate(['/login']), 1500);
        },
        error: (err) => {
          this.errorMessage = err.error?.message || 'Registration error.';
          this.isSubmitting = false;
        }
      });
  }
}