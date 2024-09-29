import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
}
const BACKEND_URL = 'http://localhost:3000/';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})

// export class AdminComponent implements OnInit {
//   username = '';
//   useremail = '';
//   userrole = 'user';
//   usergroup = ''; // Add this property
//   removeUsername = '';

//   constructor(private router: Router, private httpClient: HttpClient) {}

//   ngOnInit() {
//     if (!sessionStorage.getItem('userid')) {
//       this.router.navigate(['/login']);
//       return;
//     }
//   }

//   createUser() {
//     const userObj = {
//       'username': this.username,
//       'useremail': this.useremail,
//       'userrole': this.userrole,
//       'usergroup': this.usergroup 
//     };

//     this.httpClient.post<any>(BACKEND_URL + 'createUser', userObj, httpOptions)
//       .subscribe({
//         next: (data) => {
//           alert('User created successfully!');
//           this.clearForm();
//         },
//         error: (error) => {
//           if (error.status === 409) {
//             alert('Username already exists. Please choose a different username.');
//           } else {
//             console.error('Error creating user:', error);
//           }
//         }
//       });
//   }

//   removeUser() {
//     this.httpClient.delete<any>(BACKEND_URL + 'removeUser/' + this.removeUsername, httpOptions)
//       .subscribe({
//         next: () => {
//           alert('User removed successfully!');
//           this.removeUsername = '';
//         },
//         error: (error) => {
//           console.error('Error removing user:', error);
//         }
//       });
//   }

//   clearForm() {
//     this.username = '';
//     this.useremail = '';
//     this.userrole = 'user';
//     this.usergroup = ''; 
//   }
// }

export class AdminComponent {
  username: string = '';
  userpassword: string = '';
  useremail: string = '';
  userrole: string = 'User';  // Default role
  usergroup: string = '';
  removeUsername: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  // Create a new user
  createUser(): void {
    const newUser = {
      username: this.username,
      password: this.userpassword,
      email: this.useremail,
      role: this.userrole,
      group: this.usergroup
    };

    const token = localStorage.getItem('token');
    if (token) {
      this.http.post('http://localhost:3000/admin/create-user', newUser, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe(
        (response) => {
          console.log('User created successfully:', response);
          // Clear the form fields
          this.username = '';
          this.userpassword = '';
          this.useremail = '';
          this.userrole = 'User';
          this.usergroup = '';
        },
        (error) => {
          console.error('Error creating user:', error);
        }
      );
    }
  }

  // add a user to a group
  addUserToGroup(): void {
    const userGroupData = {
      username: this.username,
      group: this.usergroup  // Group the user is being added to
    };
  
    const token = localStorage.getItem('token');
    if (token) {
      this.http.post('http://localhost:3000/admin/add-user-to-group', userGroupData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe(
        (response) => {
          console.log('User added to group successfully:', response);
        },
        (error) => {
          console.error('Error adding user to group:', error);
        }
      );
    }
  }
  
  // Remove a user
  removeUser(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.http.delete(`http://localhost:3000/admin/remove-user/${this.removeUsername}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).subscribe(
        (response) => {
          console.log('User removed successfully:', response);
          // Clear the form field
          this.removeUsername = '';
        },
        (error) => {
          console.error('Error removing user:', error);
        }
      );
    }
  }
}