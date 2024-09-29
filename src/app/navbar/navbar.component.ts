import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgIf, RouterOutlet, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  // get isLoggedIn(): boolean {
  //   return !!sessionStorage.getItem('userrole');
  // }

  // get isAdmin(): boolean {
  //   return sessionStorage.getItem('userrole') === 'admin';
  // }

  // get isGroupAdmin(): boolean {
  //   return sessionStorage.getItem('userrole') === 'groupadmin';
  // }

  // get isUser(): boolean {
  //   return sessionStorage.getItem('userrole') === 'user';
  // }
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;
  isGroupAdmin: boolean = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.checkUserRole();
  }

  // Check if user is logged in and determine their role
  checkUserRole(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.isLoggedIn = true;
      // Decode the token to get the user role
      const decodedToken: any = jwtDecode(token);
      
      // Check user roles from the decoded token
      this.isAdmin = decodedToken.role === 'SuperAdmin';
      this.isGroupAdmin = decodedToken.role === 'GroupAdmin';
    }
  }

  // Logout function: clear the token and redirect to login page
  logout(): void {
    sessionStorage.removeItem('token');  // Remove token from localStorage
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.isGroupAdmin = false;
    this.router.navigate(['/login']);  // Redirect to login page
  }
}
