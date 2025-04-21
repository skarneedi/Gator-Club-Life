import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

interface EventItem {
  organization: string;
  title: string;
  startDate: string;
  endDate: string;
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
  showModal = false;
  selectedEvent: EventItem | null = null;

  events: EventItem[] = [
    {
      organization: 'Diversity Affirmations and Awareness Committee',
      title: 'DAAC Steps Toward Zero Discrimination',
      startDate: 'Apr 20, 2025 @ 7:00 AM',
      endDate: 'Apr 20, 2025 @ 9:00 AM',
      location: 'Stadium Route',
      description:
        'The purpose of this event is to raise awareness for zero discrimination day on March 1st and to promote our fundraiser collaboration with Chipotle to create a scholarship to send psychology graduate students to conferences.',
      category: 'Social Event/Special Interest'
    },
    {
      organization: 'Nepalese Student Association',
      title: 'Nepali Night and New Year Celebration',
      startDate: 'Apr 20, 2025 @ 1:00 PM',
      endDate: 'Apr 20, 2025 @ 10:15 PM',
      location: 'Rion Ballroom',
      description:
        'To celebrate the Nepali New Year with all the Nepalese associated with the UF. The Nepali Night and New Year Celebration is more than a cultural event...',
      category: 'Cultural'
    }
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
  }

  closeModal(): void {
    this.showModal = false;
  }
}