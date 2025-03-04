import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AnnouncementsComponent } from './announcements/announcements.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, AnnouncementsComponent],
})
export class AppComponent {
  title = 'GatorClubLife';
  isLoggedIn: boolean = false;
  showAnnouncements: boolean = false; // Default: Hide Announcements

  constructor(private router: Router) {
    if (typeof localStorage !== 'undefined') {
      this.isLoggedIn = !!localStorage.getItem('isLoggedIn'); // Check login status
    }

    // Listen for route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // Show Announcements ONLY on '/home'
        this.showAnnouncements = event.url === '/home' || event.url === '/home/';
      }
    });
  }

  logout() {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('isLoggedIn'); // Remove login status
    }
    this.isLoggedIn = false;
    this.router.navigate(['/login']); // Redirect to login page
  }
}
