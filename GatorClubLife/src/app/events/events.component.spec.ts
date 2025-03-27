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

  it('should filter events by search query', () => {
    component.searchQuery = 'Tabling';
    component.applyFilters();
    expect(component.filteredEvents.length).toBe(1);
  });

  it('should reset filters', () => {
    component.searchQuery = 'Gator';
    component.applyFilters();
    component.resetFilters();
    expect(component.filteredEvents.length).toEqual(component.events.length);
  });

  it('should filter by category', () => {
    component.filterByCategory('Music/Concert');
    expect(component.filteredEvents.every(ev => ev.category === 'Music/Concert')).toBeTrue();
  });

  it('should filter by selected date', () => {
    component.selectedDate = '2025-03-30';
    component.applyFilters();
    expect(component.filteredEvents.every(ev => ev.date === '2025-03-30')).toBeTrue();
  });
});
