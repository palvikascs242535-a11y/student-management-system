import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {

  email = '';
  password = '';
  error = '';

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    this.error = '';

    this.http.post<any>('http://localhost:5000/api/auth/login', {
      email: this.email,
      password: this.password
    })
    .subscribe({
      next: (res) => {

        console.log("LOGIN RESPONSE:", res);

        if (res.message === "Login success" && res.user) {

          // ✅ Save login session
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('adminName', res.user.name);
          localStorage.setItem('role', res.user.role);
          localStorage.setItem('userId', res.user._id);

          // ✅ Navigate to dashboard
          this.router.navigate(['/student']);

        } else {
          this.error = res.message || "Login failed";
        }
      },
      error: () => {
        this.error = "Server error";
      }
    });
  }
}