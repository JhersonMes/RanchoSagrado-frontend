import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

// Protege las páginas de "Gestión de Negocio": solo el Administrador puede entrar,
// el resto de roles es enviado a la página de Acceso no autorizado.
export const adminOnlyGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const checkRole = (): boolean => {
    if (authService.roleName().toLowerCase().includes('admin')) {
      return true;
    }
    router.navigate(['/pages/unauthorized']);
    return false;
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
