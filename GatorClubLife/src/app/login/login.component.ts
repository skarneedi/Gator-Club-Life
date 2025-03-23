// login.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  emailError: string = '';
  passwordError: string = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  login() {
    this.emailError = '';
    this.passwordError = '';
    console.log('[LoginComponent] Attempting login with email:', this.username);

    const payload = {
      email: this.username,
      password: this.password,
    };

    // The backend now returns { message: string; userName?: string }.
    this.http
      .post<{ message: string; userName?: string }>('http://localhost:8080/login', payload)
      .pipe(
        catchError((error) => {
          console.error('[LoginComponent] Login API error:', error);
          if (error.error && error.error.message === 'Incorrect password') {
            this.passwordError = 'Incorrect password';
          } else if (error.error && error.error.message === 'Invalid email or account not found') {
            this.emailError = 'Invalid email or account not found';
          } else {
            this.emailError = 'An unexpected error occurred';
          }
          return throwError(() => error);
        })
      )
      .subscribe((response) => {
        console.log('[LoginComponent] Login successful, response:', response);

        // Now we retrieve the userName from the backend's response.
        // Fallback to this.username if userName is undefined.
        const name = response.userName || this.username;

        // Update AuthService with the user’s name (not just the email).
        this.authService.setUser(name);
        console.log('[LoginComponent] User stored in AuthService:', name);

        // Navigate to home (or wherever you'd like after login).
        this.router.navigate(['/home']);
      });
  }

  goToRegister(): void {
    console.log('[LoginComponent] Navigating to Register page');
    this.router.navigate(['/register']);
  }
}
