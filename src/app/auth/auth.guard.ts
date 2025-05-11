import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';

import { AuthService } from './auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isLoggedIn().pipe(
    map((isAuth) => {
      console.log('authGuard called with: ', isAuth);
      if (!isAuth) {
        router.navigate(['/ui/auth/login']);
        return false;
      }
      return true;
    }),
    catchError(() => {
      router.navigate(['/ui/auth/login']);
      return of(false);
    })
  );
};
