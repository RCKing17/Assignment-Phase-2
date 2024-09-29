import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';


 const httpOptions = {
      headers: new HttpHeaders({'Content-Type': 'application/json'})
  };

 const BACKEND_URL = 'http://localhost:3000/';

  @Component({
  selector: 'app-account',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})

export class AccountComponent implements OnInit{
  userData$!: Observable<any>;
  // userData: any = null;
  isAdmin: boolean = false;
  isGroupAdmin: boolean = false;
  loading: boolean = true;

  constructor(private http: HttpClient, private router:Router) {}

//   ngOnInit() {
//     if (!sessionStorage.getItem('userid')) {
//       this.router.navigate(['/login']); // Redirect to login if not logged in
//       return;
//     }
//     this.loadUserData();
//   }

//   get isAdmin(): boolean {
//     return sessionStorage.getItem('userrole') === 'admin';
//   }

//   get isGroupAdmin(): boolean {
//     return sessionStorage.getItem('userrole') === 'groupadmin';
//   }

//   loadUserData() {
//     const userobj = {
//       userid: sessionStorage.getItem("userid"),
//       username: sessionStorage.getItem("username"),
//       useremail: sessionStorage.getItem("useremail"),
//       usergroup: sessionStorage.getItem("usergroup"),
//       userrole: sessionStorage.getItem("userrole")
//     };

//     this.httpClient.post<any>(BACKEND_URL + 'loginafter', userobj, httpOptions)
//       .subscribe({
//         next: (data) => {
//           this.userData = data;
//         },
//         error: (error) => {
//           console.error('Failed to load user data', error);
//         }
//       });
//   }
// }

ngOnInit(): void {
  this.loadUserData();
}

loadUserData(): void {
  const token = localStorage.getItem('token');
  this.userData$ = this.http.get<any>('http://localhost:3000/account', {
    headers: { Authorization: `Bearer ${token}`}
  }).pipe( 
    tap((response) => {
      console.log('User Data:', response);  // Log the user data to verify
      this.isAdmin = response.userrole === 'SuperAdmin';  // Set admin flags
      this.isGroupAdmin = response.userrole === 'GroupAdmin';
      }),
    );
  }
}