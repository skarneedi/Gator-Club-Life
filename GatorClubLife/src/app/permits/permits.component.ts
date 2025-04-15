// permits.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-permits',
  templateUrl: './permits.component.html',
  styleUrls: ['./permits.component.css'],
})
export class PermitsComponent {
  constructor(private router: Router) {}

  // Method to navigate to the appropriate form page
  navigateToForm(permitType: string): void {
    console.log(`Navigating to ${permitType} form...`);
    // Example routing logic:
    this.router.navigate(['/forms', permitType]);
  }
}