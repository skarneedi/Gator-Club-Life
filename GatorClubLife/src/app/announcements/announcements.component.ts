import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Announcement {
  id: number;
  title: string;
  content: string;
  date: string;
  category: string;
  expanded?: boolean;
}

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AnnouncementsComponent implements OnInit {
  announcements: Announcement[] = [];
  filteredAnnouncements: Announcement[] = [];

  categories: string[] = ['All', 'Policy', 'Event', 'Reminder'];
  selectedCategory = 'All';
  searchTerm = '';

  ngOnInit(): void {
    this.announcements = [
      {
        id: 1,
        title: 'Updating Officers 2024-2025',
        content:
          'For student organizations needing to update Presidents, VPs, and Treasurers for the academic year...',
        date: 'Feb 05, 2025',
        category: 'Policy',
      },
      {
        id: 2,
        title: 'AI Club',
        content: 'Hackathon 3.0 in Reitz Union — join us for tech, teams, and prizes!',
        date: 'Feb 04, 2025',
        category: 'Event',
      },
      {
        id: 3,
        title: 'Room Booking Reminder',
        content: 'All clubs must reserve rooms two weeks in advance via the portal.',
        date: 'Mar 01, 2025',
        category: 'Reminder',
      },
    ];
    this.filterAnnouncements();
  }

  filterAnnouncements(): void {
    this.filteredAnnouncements = this.announcements.filter((announcement) => {
      const matchesCategory =
        this.selectedCategory === 'All' || announcement.category === this.selectedCategory;
      const matchesSearch = announcement.title
        .toLowerCase()
        .includes(this.searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }

  toggleExpand(id: number): void {
    const announcement = this.announcements.find((a) => a.id === id);
    if (announcement) {
      announcement.expanded = !announcement.expanded;
    }
  }
}
