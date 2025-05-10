// src/app/admin/components/users/users.component.ts
import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { AdminUser } from '../../adminModels/adminUser.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  standalone: false,
})
export class UsersComponent implements OnInit {
  users: AdminUser[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.error = null;
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load users', err);
        this.error = 'An error occurred while loading users.';
        this.isLoading = false;
      }
    });
  }

  banUser(id: number): void {
    if (!confirm('Are you sure you want to ban this user?')) {
      return;
    }
    this.adminService.banUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => {
        console.error('Failed to ban user', err);
        this.error = 'An error occurred while banning the user.';
      }
    });
  }

  unbanUser(id: number): void {
    if (!confirm('Are you sure you want to unban this user?')) {
      return;
    }
    this.adminService.unbanUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (err) => {
        console.error('Failed to unban user', err);
        this.error = 'An error occurred while unbanning the user.';
      }
    });
  }
}
