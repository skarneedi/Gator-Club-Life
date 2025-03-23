import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  // Inject Router
  const router = inject(Router);

  // Check if running in a browser environment
  if (typeof window === 'undefined') {
    // If no window object, deny access or decide accordingly.
    router.navigate(['/login']);
    return false;
  }

  const isLoggedIn = localStorage.getItem('isLoggedIn');
  if (isLoggedIn === 'true') {
    return true; // Allow access if logged in.
  } else {
    router.navigate(['/login']); // Redirect if not logged in.
    return false;
  }
};
