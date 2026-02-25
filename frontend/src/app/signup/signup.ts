import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './signup.html',
  styleUrls: ['./signup.css']
})
export class SignupComponent {

  name = '';
  email = '';
  password = '';
  role = 'user';

  message = '';

  constructor(private http: HttpClient, private router: Router) {}

  signup() {
    this.message = '';

    this.http.post<any>('http://localhost:5000/api/auth/signup', {
      name: this.name,
      email: this.email,
      password: this.password,
      role: this.role
    })
    .subscribe({
      next: (res) => {
        this.message = res.message;

        if (res.message.includes('successful')) {
          alert("Signup successful! Wait for approval.");
          this.router.navigate(['/']);
        }
      },
      error: () => {
        this.message = "Server error";
      }
    });
  }
}