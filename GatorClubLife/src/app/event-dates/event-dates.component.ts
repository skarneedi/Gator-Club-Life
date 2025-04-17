import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

@Component({
  selector: 'app-event-dates',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule
  ],
  templateUrl: './event-dates.component.html',
  styleUrls: ['./event-dates.component.css']
})
export class EventDatesComponent {
  constructor(private router: Router) {}

  calendarOptions: any = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    events: [{ title: 'Sample Event', date: '2025-04-16' }],
    dateClick: this.handleDateClick.bind(this)
  };

  handleDateClick(arg: any) {
    const title = prompt('Enter event title:');
    if (title) {
      this.calendarOptions.events = [
        ...this.calendarOptions.events,
        { title, date: arg.dateStr }
      ];
    }
  }

  addEvent() {
    const title = prompt('Enter event title:');
    const date = prompt('Enter date (YYYY-MM-DD):');
    if (title && date) {
      this.calendarOptions.events = [
        ...this.calendarOptions.events,
        { title, date }
      ];
    }
  }

  goBack(): void {
    this.router.navigate(['/forms/basicInfo']);
  }

  goToNextPage(): void {
    this.router.navigate(['/additional-forms']);
  }
}
