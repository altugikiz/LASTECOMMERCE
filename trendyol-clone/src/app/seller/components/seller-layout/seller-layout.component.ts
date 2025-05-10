import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seller-layout',
  templateUrl: './seller-layout.component.html',
  styleUrls: ['./seller-layout.component.scss'],
  standalone: false

})
export class SellerLayoutComponent {
  constructor(private router: Router) {}

  logout(): void {
    // TODO: call your AuthService.logout()
    // then redirect to login page
    // this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
