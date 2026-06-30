import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const noCajeroGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const checkRole = (): boolean => {
    const role = authService.roleName().toLowerCase();
    if (role.includes('caj') || role.includes('cash')) {
      router.navigate(['/cajero/dashboard']);
      return false;
    }
    if (!role.includes('admin')) {
      router.navigate([authService.resolveHomeRoute(authService.roleName())]);
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
    }),
  );
};
