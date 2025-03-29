import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule, // For *ngIf and async pipe
    RouterModule, // For router-outlet
    AnnouncementsComponent, // For app-announcements
  ],
})
export class AppComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>; // Observable for login status
  userName$!: Observable<string | null>; // Updated to match AuthService
  showAnnouncements: boolean = false; // Controls visibility of announcements
  showDropdown = false; // Flag to control dropdown visibility

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to AuthService observables
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userName$ = this.authService.userName$;

    console.log('[AppComponent] Subscribed to AuthService observables');

    // Log changes in login status and user name
    this.isLoggedIn$.subscribe((loggedIn) => {
      console.log('[AppComponent] isLoggedIn changed to:', loggedIn);
    });

    this.userName$.subscribe((name) => {
      console.log('[AppComponent] userName changed to:', name);
    });

    // Listen for route changes and update showAnnouncements
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showAnnouncements = event.url === '/home' || event.url === '/home/';
        console.log('[AppComponent] NavigationEnd, showAnnouncements:', this.showAnnouncements);
      }
    });
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation(); // Prevent the click from propagating to the document
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const dropdownContainer = document.querySelector('.user-profile-dropdown');
    if (!dropdownContainer?.contains(event.target as Node)) {
      this.showDropdown = false; // Close the dropdown if clicked outside
    }
  }

  logout(): void {
    console.log('[AppComponent] Logging out user');
    this.authService.logout();
    this.router.navigate(['/login']); // Redirect to login after logout
  }
}