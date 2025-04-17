import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-events-form',
  templateUrl: './events-form.component.html',
  styleUrls: ['./events-form.component.css'],
})
export class EventsFormComponent implements OnInit {
  pageTitle: string = ''; // Dynamic page title

  constructor(
    private route: ActivatedRoute, // To access route parameters
    private router: Router // To handle navigation
  ) {}

  ngOnInit(): void {
    // Get the permit type from the route parameter
    const permitType = this.route.snapshot.paramMap.get('permitType');
    this.pageTitle = this.formatPageTitle(permitType);
  }

  // Method to format the page title
  private formatPageTitle(permitType: string | null): string {
    if (!permitType) return 'Unknown Permit Type';
    return permitType
      .split('-') // Split by hyphen
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
      .join(' ') + ' Form';
  }

  // Method to navigate to the next page (Event Dates)
  goToEventDates(): void {
    this.router.navigate(['/dates']); // Navigate to the event dates page
  }
}