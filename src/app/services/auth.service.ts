import { Injectable, computed, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { LoginService } from './login.service';
import { User } from '../model/user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly loginService = inject(LoginService);

  private readonly _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly roleName = computed(() => this._currentUser()?.role?.name ?? '');

  fetchCurrentUser() {
    return this.loginService.showUserInfo().pipe(tap((data: User) => this._currentUser.set(data)));
  }

  clearCurrentUser(): void {
    this._currentUser.set(null);
  }

  resolveHomeRoute(roleName: string | undefined | null): string {
    const role = (roleName ?? '').toLowerCase();
    if (role.includes('admin')) return '/admin/dashboard';
    if (role.includes('caj') || role.includes('cash')) return '/cajero/dashboard';
    if (role.includes('chef')) return '/pages/product';
    if (role.includes('mesero') || role.includes('waiter')) return '/pages/order';
    if (role.includes('cliente') || role.includes('client')) return '/pages/reservation';
    return '/pages/order';
  }
}
