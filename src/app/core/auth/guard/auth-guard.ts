import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  // check token ==> true | false
  if (localStorage.getItem('socialToken')) {
    return true;
  }
  // navigate login
  return router.parseUrl('auth/login');
};
