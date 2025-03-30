import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyProfileComponent } from './my-profile.component';
import { AuthService, UserInfo } from '../auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('MyProfileComponent', () => {
  let component: MyProfileComponent;
  let fixture: ComponentFixture<MyProfileComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;

  const mockUser: UserInfo = {
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Student',
    joined: '2025-01-01',
    phone: '123-456-7890',
  };

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['getUserDetails', 'setUser']);
    mockAuthService.getUserDetails.and.returnValue(mockUser);

    await TestBed.configureTestingModule({
      imports: [MyProfileComponent, CommonModule, FormsModule],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(MyProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    expect(component.user?.name).toBe('John Doe');
    expect(component.editablePhone).toBe('123-456-7890');
  });

  it('should toggle editing mode', () => {
    expect(component.isEditing).toBeFalse();
    component.toggleEdit();
    expect(component.isEditing).toBeTrue();
  });

  it('should save changes to phone number', () => {
    component.editablePhone = '987-654-3210';
    component.saveChanges();
    expect(mockAuthService.setUser).toHaveBeenCalledWith(jasmine.objectContaining({ phone: '987-654-3210' }));
    expect(component.isEditing).toBeFalse();
  });
});
