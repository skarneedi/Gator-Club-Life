import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserInfo } from '../auth.service';

interface Announcement {
  title: string;
  content: string;
  date: string;
  priority?: string;
}

@Component({
  selector: 'app-announcements',
  standalone: true,
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
  imports: [CommonModule, FormsModule]
})
export class AnnouncementsComponent implements OnInit {
  announcements: Announcement[] = [];
  user: UserInfo | null = null;
  isAdmin = false;

  newTitle = '';
  newContent = '';
  showAnnouncements = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.userInfo$.subscribe(user => {
      this.user = user;
      this.isAdmin = user?.role === 'admin';
    });

    this.http.get<any[]>('http://localhost:8080/announcements').subscribe({
      next: (data) => {
        this.announcements = data.map(a => ({
          title: a.announcement_title,
          content: a.announcement_message,
          date: a.announcement_created_at,
          priority: 'NORMAL'
        }));
      },
      error: (err) => console.error('Error fetching announcements:', err)
    });
  }

  submitAnnouncement(): void {
    if (!this.user) return;

    const payload = {
      announcement_title: this.newTitle,
      announcement_message: this.newContent,
      announcement_created_by: this.user.id
    };

    this.http.post('http://localhost:8080/announcements/create', payload).subscribe({
      next: () => {
        this.ngOnInit(); // Refresh
        this.newTitle = '';
        this.newContent = '';
      },
      error: (err) => console.error('Failed to post announcement:', err)
    });
  }
}