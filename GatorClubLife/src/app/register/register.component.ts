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
  name = '';
  email = '';
  username = '';
  password = '';
  confirmPassword = '';
  role = '';

  errorMessage = '';
  submitted = false;
  passwordNotStrong = false;
  invalidEmail = false;

  showPassword = false;
  showConfirmPassword = false;

  emailAvailable: boolean | null = null;
  usernameAvailable: boolean | null = null;
  checkingEmail = false;
  checkingUsername = false;
  emailCheckTimeout: any = null;
  usernameCheckTimeout: any = null;

  passwordStrength = 0;

  constructor(private router: Router, private http: HttpClient) {}

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onPasswordInput(): void {
    this.passwordStrength = this.calculateStrength(this.password);
    this.passwordNotStrong = this.passwordStrength < 80;
  }

  calculateStrength(password: string): number {
    let strength = 0;
    if (!password) return strength;

    const lengthCriteria = password.length >= 8;
    const uppercaseCriteria = /[A-Z]/.test(password);
    const lowercaseCriteria = /[a-z]/.test(password);
    const numberCriteria = /\d/.test(password);
    const specialCharCriteria = /[^\w\s]/.test(password);

    if (lengthCriteria) strength += 20;
    if (uppercaseCriteria) strength += 20;
    if (lowercaseCriteria) strength += 20;
    if (numberCriteria) strength += 20;
    if (specialCharCriteria) strength += 20;

    return strength;
  }

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

  private isPasswordStrong(password: string): boolean {
    return this.calculateStrength(password) >= 80;
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }
}
