import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    AnnouncementsComponent,
  ],
})
export class AppComponent implements OnInit {
  isLoggedIn$!: Observable<boolean>;
  userName$!: Observable<string>;
  showAnnouncements: boolean = false;
  showDropdown = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;

    this.userName$ = this.authService.userInfo$.pipe(
      map(user => user?.name || 'Guest')
    );    

    console.log('[AppComponent] Subscribed to AuthService observables');

    this.isLoggedIn$.subscribe((loggedIn) => {
      console.log('[AppComponent] isLoggedIn changed to:', loggedIn);
    });

    this.userName$.subscribe((name) => {
      console.log('[AppComponent] userName changed to:', name);
    });

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showAnnouncements = event.url === '/home' || event.url === '/home/';
        console.log('[AppComponent] NavigationEnd, showAnnouncements:', this.showAnnouncements);
      }
    });
  }

  toggleDropdown(event: MouseEvent): void {
    event.stopPropagation();
    this.showDropdown = !this.showDropdown;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const dropdownContainer = document.querySelector('.user-profile-dropdown');
    if (!dropdownContainer?.contains(event.target as Node)) {
      this.showDropdown = false;
    }
  }

  logout(): void {
    console.log('[AppComponent] Logging out user');
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}