import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  imports: [FormsModule,
    CommonModule,
    RouterLink
  ]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  searchQuery: string = '';
  userEvents: any[] = [];
  userHistory: any[] = [];
  newUser = { name: '', email: '' };

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.apiService.getUsers().subscribe((data) => {
      this.users = data;
      this.filteredUsers = data;
    });
  }

  searchUsers() {
    this.filteredUsers = this.users.filter(
      (user) =>
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  selectUser(user: any) {
    this.selectedUser = { ...user }; // Cria uma cópia para edição
    this.apiService.getUserRegistrations(user.id).subscribe((data) => {
      this.userEvents = data.activeEvents;
      this.loadUserHistory(user.id);
    });
  }
  loadUserHistory(userId: number) {
    this.apiService.getUserHistory(userId).subscribe((data) => {
      this.userHistory = data;
    });
  }
  

  clearSelection() {
    this.selectedUser = null;
    this.userEvents = [];
    this.userHistory = [];
  }

  createUser() {
    this.apiService.createUser(this.newUser).subscribe(() => {
      this.loadUsers();
      this.newUser = { name: '', email: '' };
    });
  }

  updateUser() {
    if (this.selectedUser) {
      this.apiService.updateUser(this.selectedUser.id, this.selectedUser).subscribe(() => {
        this.loadUsers();
        this.clearSelection();
      });
    }
  }

  deleteUser(id: number) {
    this.apiService.deleteUser(id).subscribe(() => {
      this.loadUsers();
      if (this.selectedUser?.id === id) {
        this.clearSelection();
      }
    });
  }
}