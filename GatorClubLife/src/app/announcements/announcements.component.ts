// src/app/announcements/announcements.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.css'],
  standalone: true,
  imports: [CommonModule], // Add CommonModule here
})
export class AnnouncementsComponent {
  announcements = [
    {
      title: 'Updating Officers 2024-2025',
      content: 'For student organizations needing to update Presidents, VPs, and Treasurers for the 2024-2025 academic year...',
      date: 'Feb 05, 2025',
      priority: 'HIGH_PRIORITY'
    },
    {
      title: 'AI Club',
      content: 'Hackathon 3.0 in Reitz Union',
      date: 'Feb 04, 2025',
      priority: 'HIGH_PRIORITY'
    },
    // Add more announcements here...
  ];
}