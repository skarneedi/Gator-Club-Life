import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalFormsComponent } from './additional-forms.component';

describe('AdditionalFormsComponent', () => {
  let component: AdditionalFormsComponent;
  let fixture: ComponentFixture<AdditionalFormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalFormsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
