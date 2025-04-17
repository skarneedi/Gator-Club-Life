import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDatesComponent } from './event-dates.component';

describe('EventDatesComponent', () => {
  let component: EventDatesComponent;
  let fixture: ComponentFixture<EventDatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventDatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventDatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
