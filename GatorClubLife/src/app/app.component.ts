import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AnnouncementsComponent } from './announcements/announcements.component';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule, AnnouncementsComponent, HttpClientModule],
})
export class AppComponent implements OnInit {
  title = 'GatorClubLife';
  isLoggedIn$!: Observable<boolean>;
  userName$!: Observable<string>;
  showAnnouncements: boolean = false;

  constructor(private router: Router, private authService: AuthService, private http: HttpClient) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.showAnnouncements = event.url === '/home' || event.url === '/home/';
        console.log('[AppComponent] NavigationEnd, showAnnouncements:', this.showAnnouncements);
      }
    });
  }

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.userName$ = this.authService.userName$;
    console.log('[AppComponent] Subscribed to AuthService observables');
    this.isLoggedIn$.subscribe((loggedIn) => {
      console.log('[AppComponent] isLoggedIn changed to:', loggedIn);
    });
    this.userName$.subscribe((name) => {
      console.log('[AppComponent] userName changed to:', name);
    });
  }

  logout() {
    console.log('[AppComponent] Logging out user');
    this.http.post('http://localhost:8080/logout', {}).subscribe({
      next: () => {
        console.log('[AppComponent] Logout successful from backend');
        this.authService.clearUser();
        this.router.navigate(['/login']);
        console.log('[AppComponent] User logged out, navigated to login');
      },
      error: (error) => {
        console.error('[AppComponent] Logout error:', error);
      }
    });
  }
}
