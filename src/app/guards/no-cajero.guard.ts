import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const noCajeroGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const checkRole = (): boolean => {
    const isCajero = authService.roleName().toLowerCase().includes('caj');
    if (isCajero) {
      router.navigate(['/cajero/dashboard']);
      return false;
    }
    return true;
  };

  if (authService.currentUser()) {
    return checkRole();
  }

  return authService.fetchCurrentUser().pipe(
    map(() => checkRole()),
    catchError(() => {
      router.navigate(['/login']);
      return of(false);
    })
  );
};
