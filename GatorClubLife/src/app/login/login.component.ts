import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule],
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private router: Router) {}

  login() {
    if (this.username === 'admin' && this.password === 'password') {
      // Ensure localStorage is available before accessing it
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('isLoggedIn', 'true'); // Mark user as logged in
      }
      this.router.navigate(['/home']); // Redirect to homepage
    } else {
      alert('Invalid credentials');
    }
  }
}