import { Component, OnInit } from '@angular/core';
import { AnnouncementsService } from '../services/announcements.service';  // Import the service
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  activeTab = 'users';

  users: any[] = [];
  events: any[] = [];
  organizations: any[] = [];
  permits: any[] = [];
  logs: string[] = [];
  feedback: any[] = [];
  categories: string[] = [];
  maintenanceMode = false;

  newAnnouncement = { title: '', content: '', category: '' }; // Store the new announcement data
  announcementPosted = false;

  constructor(private announcementsService: AnnouncementsService, private http: HttpClient) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadEvents();
    this.loadOrganizations();
    this.loadPermits();
    this.loadLogs();
    this.loadFeedback();
    this.loadCategories();
  }

  // Switch active tab (e.g., users, events)
  switchTab(tab: string): void {
    this.activeTab = tab;
  }

  // Load users from backend (you can modify this based on actual API endpoint)
  loadUsers(): void {
    this.http.get<any[]>('http://localhost:8080/users', { withCredentials: true })
      .subscribe(data => this.users = data);
  }

  // Load events (this can be replaced with dynamic data from your backend)
  loadEvents(): void {
    this.events = [
      { id: 1, title: 'Robotics Expo', date: '2025-04-25', location: 'Engineering Hall' },
      { id: 2, title: 'AI Bootcamp', date: '2025-05-01', location: 'Tech Auditorium' },
    ];
  }

  // Load organizations (replace with dynamic data from your backend)
  loadOrganizations(): void {
    this.organizations = [
      { name: 'AI Explorers', description: 'Interested in AI & ML' },
      { name: 'Pre-Law Society', description: 'Law prep and networking' },
      { name: 'Robotics Club', description: 'Robotics and automation' }
    ];
  }

  // Load permits (replace with dynamic data from your backend)
  loadPermits(): void {
    this.permits = [
      { id: 1, event: 'Charity Run', submittedBy: 'sonali@ufl.edu', status: 'Pending' },
      { id: 2, event: 'AI Hackathon', submittedBy: 'yash@ufl.edu', status: 'Approved' },
    ];
  }

  // Load logs (replace with dynamic data from your backend)
  loadLogs(): void {
    this.logs = [
      'User yash@ufl.edu created an event.',
      'Announcement posted by admin.',
      'Permit approved for Robotics Expo.'
    ];
  }

  // Load feedback (replace with dynamic data from your backend)
  loadFeedback(): void {
    this.feedback = [
      { name: 'Emma', message: 'Great experience at the AI event!' },
      { name: 'Liam', message: 'More events for engineers please.' }
    ];
  }

  // Load categories (you can replace with dynamic categories)
  loadCategories(): void {
    this.categories = ['Health', 'Tech', 'Cultural', 'Fitness'];
  }

  // Delete event (this will update the local events list)
  deleteEvent(id: number): void {
    this.events = this.events.filter(e => e.id !== id);
  }

  // Post a new announcement using the AnnouncementsService
  postAnnouncement(): void {
    if (this.newAnnouncement.title && this.newAnnouncement.content) {
      // Call the service to post the new announcement to the backend
      this.announcementsService.postAnnouncement(this.newAnnouncement);
      this.announcementPosted = true;
      
      // Reset the announcement fields
      setTimeout(() => {
        this.announcementPosted = false;
      }, 3000);

      // Reset form data
      this.newAnnouncement = { title: '', content: '', category: '' };
    }
  }

  // Approve permit (this is just a simple status update)
  approvePermit(id: number): void {
    const permit = this.permits.find(p => p.id === id);
    if (permit) permit.status = 'Approved';
  }

  // Toggle maintenance mode on/off
  toggleMaintenance(): void {
    this.maintenanceMode = !this.maintenanceMode;
  }

  // Add a new category
  addCategory(newCat: string): void {
    if (newCat && !this.categories.includes(newCat)) {
      this.categories.push(newCat);
    }
  }
}
