// import { Component } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { Router } from '@angular/router';
// import { JsonPipe, NgIf } from '@angular/common';
// import { HttpClient, HttpHeaders } from '@angular/common/http';

// const httpOptions = {
//   headers: new HttpHeaders({'Content-Type': 'application/json'})
// }

// const BACKEND_URL = 'http://localhost:3000/';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule, NgIf, JsonPipe],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.css']  // Corrected from 'styleUrl' to 'styleUrls'
// })

// export class LoginComponent {
//   username = "";
//   password = "";

//   constructor(private router: Router, private httpClient: HttpClient) {}
  
//   submit(){
//     let user = {username:this.username, pwd: this.password};
//     this.httpClient.post(BACKEND_URL + 'login', user, httpOptions)
//     //this.httpClient.post(BACKEND_URL+'login', user)
//     .subscribe((data: any) => {
//       // alert("posting: " + JSON.stringify(user));
//       // alert("postRes: " + JSON.stringify(data));
//       if (data.ok) {
//         // alert("correct!");
//         sessionStorage.setItem("userid", data.userid.toString());
//         sessionStorage.setItem("userlogin", data.ok.toString());
//         sessionStorage.setItem("username", data.username);
//         sessionStorage.setItem("useremail", data.useremail);
//         sessionStorage.setItem("usergroup", data.usergroup.toString());
//         sessionStorage.setItem("userrole", data.userrole);
//         this.router.navigateByUrl("/account");
//     } else {
//         alert("Email or password incorrect!");
//     }
    
//   })
//   }
// }



import { JsonPipe, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';  // Import HttpClient for making HTTP requests
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, JsonPipe],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';  // Bind to the username input field
  password: string = '';  // Bind to the password input field
  errorMessage: string = '';  // To show error messages

  constructor(private http: HttpClient, private router: Router) {}

  // Method triggered when the user submits the login form
//   submit() {
//     // Basic validation
//     if (this.username.trim() === '' || this.password.trim() === '') {
//       this.errorMessage = 'Both fields are required!';
//       return;
//     }

//     // Send login request to the backend
//     this.http.post('http://localhost:3000/login', {
//       username: this.username,
//       password: this.password
//     }).subscribe(
//       (response: any) => {
//         // Handle successful login, store the token, and navigate to another page
//         console.log('works', response)
//         this.router.navigate(['/account']);
//       },
//       (error) => {
//         // Handle login error
//         console.log("doesn't work")
//         this.errorMessage = 'Invalid username or password!';
//       }
//     );
//   }
// }

  submit() {
    if (this.username.trim() === '' || this.password.trim() === '') {
      this.errorMessage = 'Both fields are required!';
      return;
    }

    this.http.post<any>('http://localhost:3000/login', {
      username: this.username,
      password: this.password
    }).subscribe(
      (response) => {
        // Store JWT token in localStorage
        localStorage.setItem('username', this.username)
        localStorage.setItem('token', response.token);
        // Redirect to the account page
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        this.errorMessage = 'Invalid username or password!';
      }
    );
  }
}
