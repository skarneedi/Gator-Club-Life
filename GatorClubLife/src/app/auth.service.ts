import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // BehaviorSubjects store the latest value and emit it to new subscribers.
  private loggedInSubject = new BehaviorSubject<boolean>(false);
  private userNameSubject = new BehaviorSubject<string>('');

  // Public observables for components to subscribe to.
  isLoggedIn$ = this.loggedInSubject.asObservable();
  userName$ = this.userNameSubject.asObservable();

  constructor() {
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const storedName = localStorage.getItem('userName') || '';
      this.loggedInSubject.next(isLoggedIn);
      this.userNameSubject.next(storedName);

      console.log('[AuthService] Initialized with values:', {
        isLoggedIn,
        storedName,
      });
    }
  }
  
  // Call this method after a successful login to store the user's name.
  setUser(userName: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userName', userName);
      console.log('[AuthService] Session created for user:', userName);
    }
    this.loggedInSubject.next(true);
    this.userNameSubject.next(userName);
  }
  
  // Call this on logout to clear the user session.
  clearUser(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userName');
      console.log('[AuthService] Session cleared (user logged out)');
    }
    this.loggedInSubject.next(false);
    this.userNameSubject.next('');
  }
}
