// src/app/events/events.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class EventsComponent {
  searchTerm = '';
  events = [
    {
      title: 'Event 1',
      date: 'Feb 9, 2025',
      time: '6:00 PM - 8:00 PM',
      location: 'Room 3315',
      description: 'Description of Event 1',
      link: '#'
    },
    {
      title: 'Event 2',
      date: 'Feb 10, 2025',
      time: '7:00 PM - 9:00 PM',
      location: 'Room 4420',
      description: 'Description of Event 2',
      link: '#'
    },
    {
      title: 'Event 3',
      date: 'Feb 11, 2025',
      time: '5:00 PM - 7:00 PM',
      location: 'Room 5530',
      description: 'Description of Event 3',
      link: '#'
    },
    {
      title: 'Event 4',
      date: 'Feb 12, 2025',
      time: '6:30 PM - 8:30 PM',
      location: 'Room 6640',
      description: 'Description of Event 4',
      link: '#'
    },
    {
      title: 'Event 5',
      date: 'Feb 13, 2025',
      time: '7:30 PM - 9:30 PM',
      location: 'Room 7750',
      description: 'Description of Event 5',
      link: '#'
    },
    {
      title: 'Event 6',
      date: 'Feb 14, 2025',
      time: '8:00 PM - 10:00 PM',
      location: 'Room 8860',
      description: 'Description of Event 6',
      link: '#'
    },
    {
      title: 'Event 7',
      date: 'Feb 15, 2025',
      time: '6:00 PM - 8:00 PM',
      location: 'Room 9970',
      description: 'Description of Event 7',
      link: '#'
    },
    {
      title: 'Event 8',
      date: 'Feb 16, 2025',
      time: '7:00 PM - 9:00 PM',
      location: 'Room 10100',
      description: 'Description of Event 8',
      link: '#'
    },
    {
      title: 'Event 9',
      date: 'Feb 17, 2025',
      time: '5:00 PM - 7:00 PM',
      location: 'Room 11110',
      description: 'Description of Event 9',
      link: '#'
    }
  ];

  get filteredEvents() {
    return this.events.filter(event =>
      event.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}