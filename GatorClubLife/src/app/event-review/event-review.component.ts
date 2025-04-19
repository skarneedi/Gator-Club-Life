import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { EventPermitService } from '../services/event-permit.service';

@Component({
  selector: 'app-event-review',
  templateUrl: './event-review.component.html',
  styleUrls: ['./event-review.component.css']
})
export class EventReviewComponent {
  constructor(
    private router: Router,
    private http: HttpClient,
    public permitService: EventPermitService
  ) {}

  goBack() {
    this.router.navigate(['/additional-forms']);
  }

  submitForm() {
    const payload = this.permitService.getFinalPayload();

    this.http.post('http://localhost:8080/event-permits/submit', payload).subscribe({
      next: () => {
        alert('Event permit submitted successfully!');
        this.permitService.reset(); // Clear stored data
        this.router.navigate(['/home']); // or '/thank-you'
      },
      error: (err) => {
        console.error('Submission failed:', err);
        alert('Something went wrong. Please try again.');
      }
    });
  }
}
