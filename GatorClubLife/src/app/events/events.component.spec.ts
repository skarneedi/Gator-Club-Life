import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventsComponent } from './events.component';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

describe('EventsComponent', () => {
  let component: EventsComponent;
  let fixture: ComponentFixture<EventsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventsComponent, CommonModule, FormsModule, RouterModule.forRoot([])],
    }).compileComponents();

    fixture = TestBed.createComponent(EventsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should open and close modal correctly', () => {
    const event = component.events[0];
    component.openModal(event);
    expect(component.showModal).toBeTrue();
    expect(component.selectedEvent).toEqual(event);

    component.closeModal();
    expect(component.showModal).toBeFalse();
  });

  it('should filter by search query', () => {
    component.searchQuery = 'Nepali';
    component.applyFilters();
    expect(component.filteredEvents.length).toBe(1);
  });

  it('should reset filters', () => {
    component.searchQuery = 'Nepali';
    component.applyFilters();
    component.resetFilters();
    expect(component.filteredEvents.length).toEqual(component.events.length);
  });

  it('should filter by category', () => {
    component.filterByCategory('Cultural');
    expect(component.filteredEvents.every(e => e.category === 'Cultural')).toBeTrue();
  });
});
