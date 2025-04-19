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
  invalidEmail = false;

  // Password visibility toggles
  showPassword = false;
  showConfirmPassword = false;

  // Email/Username check flags
  emailAvailable: boolean | null = null;
  usernameAvailable: boolean | null = null;
  checkingEmail = false;
  checkingUsername = false;
  emailCheckTimeout: any = null;
  usernameCheckTimeout: any = null;

  constructor(private router: Router, private http: HttpClient) {}

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onPasswordInput(): void {
    if (this.password) {
      this.passwordNotStrong = !this.isPasswordStrong(this.password);
    } else {
      this.passwordNotStrong = false;
    }
  }

  private isPasswordStrong(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/;
    return strongPasswordRegex.test(password);
  }

  /**
   * Checks email availability
   * TODO: Replace URL with backend API for email check
   */
  checkEmailAvailability(): void {
    if (this.emailCheckTimeout) clearTimeout(this.emailCheckTimeout);
    const uflEmailRegex = /^[a-zA-Z0-9._%+-]+@ufl\.edu$/;
    if (!this.email || !uflEmailRegex.test(this.email)) {
      this.emailAvailable = null;
      return;
    }

    this.checkingEmail = true;
    this.emailAvailable = null;

    this.emailCheckTimeout = setTimeout(() => {
      this.http
        .get<{ available: boolean }>(`/api/placeholder/check-email?email=${encodeURIComponent(this.email)}`)
        .subscribe({
          next: res => {
            this.emailAvailable = res.available;
            this.checkingEmail = false;
          },
          error: () => {
            this.emailAvailable = null;
            this.checkingEmail = false;
          }
        });
    }, 400);
  }

  /**
   * Checks username availability
   * TODO: Replace URL with backend API for username check
   */
  checkUsernameAvailability(): void {
    if (this.usernameCheckTimeout) clearTimeout(this.usernameCheckTimeout);
    if (!this.username) {
      this.usernameAvailable = null;
      return;
    }

    this.checkingUsername = true;
    this.usernameAvailable = null;

    this.usernameCheckTimeout = setTimeout(() => {
      this.http
        .get<{ available: boolean }>(`/api/placeholder/check-username?username=${encodeURIComponent(this.username)}`)
        .subscribe({
          next: res => {
            this.usernameAvailable = res.available;
            this.checkingUsername = false;
          },
          error: () => {
            this.usernameAvailable = null;
            this.checkingUsername = false;
          }
        });
    }, 400);
  }

  register(): void {
    this.errorMessage = '';
    this.submitted = true;

    if (!this.name || !this.email || !this.username || !this.password || !this.confirmPassword || !this.role) {
      return;
    }

    const uflEmailRegex = /^[a-zA-Z0-9._%+-]+@ufl\.edu$/;
    if (!uflEmailRegex.test(this.email)) {
      this.invalidEmail = true;
      this.errorMessage = 'Please use a valid @ufl.edu email address.';
      return;
    } else {
      this.invalidEmail = false;
    }

    if (this.emailAvailable === false || this.usernameAvailable === false) {
      this.errorMessage = 'Email or Username is already taken.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    if (!this.isPasswordStrong(this.password)) {
      this.errorMessage =
        'Password must be at least 8 characters long and include uppercase, lowercase, digit, and special character.';
      this.passwordNotStrong = true;
      return;
    }

    const payload = {
      user_name: this.username,
      user_email: this.email,
      user_role: this.role,
      user_password: this.password,
    };

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
