import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent implements OnInit {
  activeTab = 'users';

  users: any[] = [];
  events: any[] = [];
  organizations: any[] = [];
  permits: any[] = [];

  newAnnouncement = { title: '', content: '', category: '' };
  announcementPosted = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadEvents();
    this.loadOrganizations();
    this.loadPermits();
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  loadUsers(): void {
    this.http.get<any[]>('http://localhost:8080/users', { withCredentials: true })
      .subscribe(data => this.users = data);
  }

  loadEvents(): void {
    this.events = [
      { id: 1, title: 'Robotics Expo', date: '2025-04-25', location: 'Engineering Hall' },
      { id: 2, title: 'AI Bootcamp', date: '2025-05-01', location: 'Tech Auditorium' },
    ];
  }

  loadOrganizations(): void {
    this.organizations = [
      { name: 'AI Explorers', description: 'Interested in AI & ML' },
      { name: 'Pre-Law Society', description: 'Law prep and networking' },
      { name: 'Robotics Club', description: 'Robotics and automation' }
    ];
  }

  loadPermits(): void {
    this.permits = [
      { id: 1, event: 'Charity Run', submittedBy: 'sonali@ufl.edu', status: 'Pending' },
      { id: 2, event: 'AI Hackathon', submittedBy: 'yash@ufl.edu', status: 'Approved' },
    ];
  }

  deleteEvent(id: number): void {
    this.events = this.events.filter(e => e.id !== id);
  }

  postAnnouncement(): void {
    if (this.newAnnouncement.title && this.newAnnouncement.content) {
      console.log('Posting announcement:', this.newAnnouncement);
      this.announcementPosted = true;
      setTimeout(() => this.announcementPosted = false, 3000);
      this.newAnnouncement = { title: '', content: '', category: '' };
    }
  }

  approvePermit(id: number): void {
    const permit = this.permits.find(p => p.id === id);
    if (permit) permit.status = 'Approved';
  }
}