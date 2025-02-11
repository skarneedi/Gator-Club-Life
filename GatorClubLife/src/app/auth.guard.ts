import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  const router = inject(Router);

  if (isLoggedIn === 'true') {
    return true; // Allow access to the route
  } else {
    router.navigate(['/login']); // Redirect to login page
    return false;
  }
};