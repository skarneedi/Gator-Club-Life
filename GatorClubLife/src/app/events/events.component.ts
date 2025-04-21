import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface EventItem {
  organization: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  category: string;
  rsvped?: boolean;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  searchQuery = '';
  selectedDate: string = '';
  selectedCategory: string = 'All';
  showModal = false;
  selectedEvent: EventItem | null = null;
  filteredEvents: EventItem[] = [];
  userEmail: string = '';
  rsvpMessage: string = '';

  events: EventItem[] = [
    {
      organization: 'Nepalese Student Association',
      title: 'Nepali Night',
      startDate: 'Apr 20, 2025 @ 6:00 PM',
      endDate: 'Apr 20, 2025 @ 9:00 PM',
      location: 'Reitz Union',
      description: 'Celebrate New Year with food, music, and dance.',
      category: 'Cultural',
    },
    {
      organization: 'AI Club',
      title: 'AI Meetup',
      startDate: 'Apr 22, 2025 @ 5:00 PM',
      endDate: 'Apr 22, 2025 @ 7:00 PM',
      location: 'CSE Hall',
      description: 'Talks and networking on machine learning.',
      category: 'Academic',
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      this.userEmail = JSON.parse(userData)?.user_email || '';
    }
    this.filteredEvents = [...this.events];
  }

  applyFilters(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = this.searchQuery === '' ||
        event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        event.organization.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesDate = this.selectedDate === '' ||
        event.startDate.includes(this.selectedDate);

      const matchesCategory = this.selectedCategory === 'All' ||
        event.category === this.selectedCategory;

      return matchesSearch && matchesDate && matchesCategory;
    });
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedDate = '';
    this.selectedCategory = 'All';
    this.filteredEvents = [...this.events];
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  openModal(event: EventItem): void {
    this.selectedEvent = event;
    this.showModal = true;
    this.rsvpMessage = '';
  }

  closeModal(): void {
    this.showModal = false;
  }

  rsvpToEvent(): void {
    if (this.selectedEvent) {
      this.selectedEvent.rsvped = true;
      this.rsvpMessage = 'RSVP confirmed! Confirmation sent to ' + this.userEmail;

      // Simulate sending email (replace with real API call)
      this.http.post('http://localhost:8080/events/send-confirmation', {
        email: this.userEmail,
        event: this.selectedEvent.title
      }).subscribe();
    }
  }

  undoRSVP(): void {
    if (this.selectedEvent) {
      this.selectedEvent.rsvped = false;
      this.rsvpMessage = 'RSVP canceled.';
    }
  }
}
