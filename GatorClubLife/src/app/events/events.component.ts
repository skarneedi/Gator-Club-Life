import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface EventItem {
  organization: string;
  title: string;
  date: string;
  location: string;
  description: string;
  category: string;
}

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  searchQuery = '';
  selectedDate: string = '';
  selectedCategory: string = 'All';

  events: EventItem[] = [
    {
      organization: 'FRIENDS FOR LIFE OF AMERICA',
      title: 'Tabling',
      date: '2025-03-26',
      location: 'Turlington Plaza',
      description: 'Increase membership and raise awareness of pediatric cancer.',
      category: 'Community Service',
    },
    {
      organization: 'ZETA PHI BETA',
      title: 'Reproductive Health Talk',
      date: '2025-03-26',
      location: 'Shands Auditorium',
      description: 'Raises awareness of female reproductive health.',
      category: 'Health/Wellness',
    },
    {
      organization: 'GATOR BAND',
      title: 'Gator Band 5K Permit',
      date: '2025-03-30',
      location: 'Fraternity Row Route',
      description: 'Annual 5K run for alumni and students.',
      category: '5k (Run/Walk)',
    },
    {
      organization: 'PHI KAPPA TAU',
      title: 'Top 10 Singer Competition',
      date: '2025-03-28',
      location: 'University Auditorium',
      description: 'An event showcasing vocal talent.',
      category: 'Music/Concert',
    },
    {
      organization: 'PHI KAPPA TAU',
      title: 'Top 10 Singer Competition',
      date: '2025-03-28',
      location: 'University Auditorium',
      description: 'An event showcasing vocal talent.',
      category: 'Music/Concert',
    },
    {
      organization: 'PHI KAPPA TAU',
      title: 'Top 10 Singer Competition',
      date: '2025-03-28',
      location: 'University Auditorium',
      description: 'An event showcasing vocal talent.',
      category: 'Music/Concert',
    },
    {
      organization: 'PHI KAPPA TAU',
      title: 'Top 10 Singer Competition',
      date: '2025-03-28',
      location: 'University Auditorium',
      description: 'An event showcasing vocal talent.',
      category: 'Music/Concert',
    },
    {
      organization: 'Bouquet Making Event',
      title: 'Top 10 Singer Competition',
      date: '2025-03-28',
      location: 'University Auditorium',
      description: 'An event showcasing vocal talent.',
      category: 'Music/Concert',
    },
    {
      organization: 'Bouquet Making Event',
      title: 'Top 10 Singer Competition',
      date: '2025-03-28',
      location: 'University Auditorium',
      description: 'An event showcasing vocal talent.',
      category: 'Music/Concert',
    },
    
  ];

  filteredEvents: EventItem[] = [];

  ngOnInit(): void {
    this.filteredEvents = [...this.events];
  }

  applyFilters(): void {
    this.filteredEvents = this.events.filter(event => {
      const matchesSearch = this.searchQuery === '' ||
        event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        event.organization.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesDate = this.selectedDate === '' ||
        event.date === this.selectedDate;

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

  selectDate(date: string): void {
    this.selectedDate = date;
    this.applyFilters();
  }

  filterByCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }
}
