import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';

import { AuthService } from './auth.service';

export const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    map((isAuth) => {
      //console.log('authGuard called with: ', isAuth);
      if (!isAuth) {
        router.navigate(['/ui/auth/login']);
        return false;
      } else {
        return true;
      }
    })
  );
};
