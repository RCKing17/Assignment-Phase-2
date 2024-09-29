import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

// export class DashboardComponent {
//   get isAdmin(): boolean {
//     return sessionStorage.getItem('userrole') === 'admin';
//   }

//   get isGroupAdmin(): boolean {
//     return sessionStorage.getItem('userrole') === 'groupadmin';
//   }

//   get isUser(): boolean {
//     return sessionStorage.getItem('userrole') === 'user';
//   }
// }

export class DashboardComponent implements OnInit {
  isAdmin = false;
  isGroupAdmin = false;
  isUser = false;
  username: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUserRole();
  }

  // Fetch the user's role and username from the backend
  loadUserRole(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.http.get<any>('http://localhost:3000/profile', {
        headers: {
          Authorization: `Bearer ${token}`  // Include the JWT token in headers
        }
      }).subscribe(
        (data) => {
          this.username = data.username;
          this.setUserRole(data.role);  // Set role flags based on the user's role
        },
        (error) => {
          console.error('Error loading profile:', error);
          this.router.navigate(['/login']);  // Redirect to login if token is invalid
        }
      );
    } else {
      this.router.navigate(['/login']);  // Redirect if no token is found
    }
  }

  // Set the role flags for conditional display
  setUserRole(role: string): void {
    this.isAdmin = role === 'SuperAdmin';
    this.isGroupAdmin = role === 'GroupAdmin';
    this.isUser = role === 'User';
  }

  // Logout functionality
  logout(): void {
    localStorage.removeItem('token');  // Remove the token
    this.router.navigate(['/login']);  // Redirect to login page
  }
}