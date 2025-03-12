import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule], // Correctly import these modules
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  emailError: string = ''; // Error for invalid email
  passwordError: string = ''; // Error for incorrect password

  constructor(private router: Router, private http: HttpClient) {}

  login() {
    // Clear previous errors
    this.emailError = '';
    this.passwordError = '';

    // Validate email format
    if (!this.isValidEmail(this.username)) {
      this.emailError = 'Invalid email address';
      return;
    }

    const payload = {
      email: this.username,
      password: this.password,
    };

    this.http
      .post<{ message: string }>('http://localhost:8080/login', payload)
      .pipe(
        catchError((error) => {
          console.error('Login API error:', error); // Log the error for debugging

          // Check the error message from the backend
          if (error.error && error.error.message === 'Incorrect password') {
            this.passwordError = 'Incorrect password'; // Set password error
          } else if (error.error && error.error.message === 'Invalid email or account not found') {
            this.emailError = 'Invalid email or account not found'; // Set email error
          } else {
            this.emailError = 'An unexpected error occurred'; // Generic error
          }
          return throwError(() => error);
        })
      )
      .subscribe((response) => {
        // On successful login, mark as logged in and navigate to home
        localStorage.setItem('isLoggedIn', 'true');
        this.router.navigate(['/home']);
      });
  }

  goToRegister(): void {
    this.router.navigate(['/register']); // Navigate to Register page
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}