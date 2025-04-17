import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-review',
  templateUrl: './event-review.component.html',
  styleUrls: ['./event-review.component.css']
})
export class EventReviewComponent {
  constructor(private router: Router) {}

  goBack() {
    this.router.navigate(['/additional-forms']);
  }

  submitForm() {
    // Add final submission logic here
    alert('Form submitted successfully!');
    this.router.navigate(['/home']); // or wherever you want to redirect after submission
  }
}
