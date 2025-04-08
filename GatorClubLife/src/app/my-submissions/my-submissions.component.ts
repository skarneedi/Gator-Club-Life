import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Required for *ngIf

@Component({
  selector: 'app-my-submissions',
  templateUrl: './my-submissions.component.html',
  styleUrls: ['./my-submissions.component.css'],
  standalone: true,
  imports: [CommonModule], // Import CommonModule for *ngIf
})
export class MySubmissionsComponent {
  activeTab: string = 'org-registrations'; // Default active tab

  // Method to set the active tab
  setActiveTab(tabName: string): void {
    this.activeTab = tabName;
  }
}