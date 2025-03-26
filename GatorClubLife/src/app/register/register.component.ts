import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
})
export class RegisterComponent {
  // Form fields
  name = '';
  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  role = '';

  // Error messages & flags
  errorMessage = '';
  submitted = false;
  passwordNotStrong = false;

  // Eye icon toggle for password
  showPassword = false;

  constructor(private router: Router, private http: HttpClient) {}

  // Toggle password visibility
  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Check password strength while typing
  onPasswordInput(): void {
    if (this.password) {
      this.passwordNotStrong = !this.isPasswordStrong(this.password);
    } else {
      this.passwordNotStrong = false;
    }
  }

  // Regex check for strong password
  private isPasswordStrong(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    return strongPasswordRegex.test(password);
  }

  register(): void {
    this.errorMessage = '';
    this.submitted = true;

    // Check for missing fields
    if (!this.name || !this.email || !this.username || !this.password || !this.confirmPassword || !this.role) {
      return;
    }

    // Check password match
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    // Final password strength check
    if (!this.isPasswordStrong(this.password)) {
      this.errorMessage =
        'Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.';
      this.passwordNotStrong = true;
      return;
    }

    // Prepare payload
    const payload = {
      user_name: this.username,
      user_email: this.email,
      user_role: this.role,
      user_password: this.password,
    };

    // Send POST request
    this.http
      .post<{ user_id: number }>('http://localhost:8080/users/create', payload)
      .pipe(
        catchError((error) => {
          this.errorMessage = error.error || 'Registration failed!';
          return throwError(() => error);
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
