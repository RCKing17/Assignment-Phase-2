import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';


// const httpOptions = {
//   headers: new HttpHeaders({'Content-Type': 'application/json'})
// }
  const BACKEND_URL = 'http://localhost:3000/';  // Static property

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']  // Correct styleUrls instead of styleUrl
})

export class ProfileComponent implements OnInit {
  userid: number | undefined;
  username: string = '';
  useremail: string = '';
  usergroup: string = '';
  userrole: string = '';
  selectedFile: File | null = null;

  //constructor is to "initialize" or "pre-filled" the value in the form"
  constructor(private router: Router, private http: HttpClient) {
    
    // this.username = sessionStorage.getItem('username')!;
    // this.useremail = sessionStorage.getItem('useremail')!;
    // this.usergroup = sessionStorage.getItem('usergroup')!;
    // this.userrole = sessionStorage.getItem('userrole')!;
    // this.userid = Number(sessionStorage.getItem('userid'));
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  // Fetch the user profile from the backend
  loadUserProfile(): void {
    const token = localStorage.getItem('token');

    if (token) {
      this.http.get<any>('http://localhost:3000/profile', {
        headers: {
          Authorization: `Bearer ${token}`  // Include JWT in headers
        }
      }).subscribe(
        (data) => {
          this.userid = data.id;
          this.username = data.username;
          this.useremail = data.email;
          this.usergroup = data.group;
          this.userrole = data.role;
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

  // Update user profile (email, group, etc.)
  editFunc(): void {
    const token = localStorage.getItem('token');

    if (token) {
      const updatedProfile = {
        email: this.useremail,
        group: this.usergroup,
        role: this.userrole
      };

      this.http.put('http://localhost:3000/profile', updatedProfile, {
        headers: {
          Authorization: `Bearer ${token}`  // Include JWT in headers
        }
      }).subscribe(
        (response) => {
          console.log('Profile updated successfully', response);
        },
        (error) => {
          console.error('Error updating profile:', error);
        }
      );
    }
  }
  joinGroup(): void {
    const groupData = {
      username: this.username,  // Username of the logged-in user
      group: this.usergroup  // Group the user wants to join
    };
  
    const token = localStorage.getItem('token');
    if (token) {
      this.http.post('http://localhost:3000/user/join-group', groupData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe(
        (response) => {
          console.log('User joined group successfully:', response);
        },
        (error) => {
          console.error('Error joining group:', error);
        }
      );
    }
  }    
}





//   ngOnInit() {
//     if (!sessionStorage.getItem('userid')) {
//       this.router.navigate(['/login']); // Redirect to login if not logged in
//       return;
//     }
//   }
//   editFunc() {
//     let userobj = {
//       'userid': this.userid,
//       'username': this.username,
//       'useremail': this.useremail,
//       'usergroup': this.usergroup,
//       'userrole': this.userrole
//     };

//     this.httpClient.post<any>(BACKEND_URL + 'loginafter', userobj, httpOptions)
//     .subscribe({
//       next: (data) => {
//         sessionStorage.setItem('username', data.username);
//         sessionStorage.setItem('useremail', data.useremail);
//         sessionStorage.setItem('usergroup', data.usergroup);
//         sessionStorage.setItem('userrole', data.userrole);
//         alert('Profile updated successfully!');
//         this.router.navigateByUrl("/account");
//       },
//       error: (error) => {
//         console.error('Error updating user data:', error);
//       }
//     });
//   }
// }