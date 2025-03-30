import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { AuthService, UserInfo } from '../auth.service';

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

    const payload = {
      email: this.username,
      password: this.password,
    };

    this.http
    .post<any>('http://localhost:8080/login', payload)
      .pipe(
        catchError((error) => {
          if (error.error?.message === 'Incorrect password') {
            this.passwordError = 'Incorrect password';
          } else if (error.error?.message === 'Invalid email or account not found') {
            this.emailError = 'Invalid email or account not found';
          } else {
            this.emailError = 'An unexpected error occurred';
          }
          return throwError(() => error);
        })
      )
      .subscribe((response) => {
        const userInfo: UserInfo = {
          id: response.user_id,
          name: response.user_name || this.username,
          email: response.user_email || this.username,
          role: response.user_role || 'member',
          joined: new Date(response.user_created_at * 1000).toISOString().split('T')[0] // convert UNIX timestamp
        };

        this.authService.setUser(userInfo);
        this.router.navigate(['/home']);
      });
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}
