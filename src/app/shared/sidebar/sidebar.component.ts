import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';
import { environment } from '../../../environments/environment.development';

interface SidebarLink {
  label: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly loginService = inject(LoginService);

  private static readonly ICONS: Record<string, string> = {
    Dashboard:
      'M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z',
    Negocio: 'M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 11h.01M15 11h.01',
    Pedidos:
      'M9 12h3.75M9 15h3.75M9 18h3.75M3.75 6.75h16.5M3.75 6.75v10.5A2.25 2.25 0 006 19.5h12a2.25 2.25 0 002.25-2.25V6.75M3.75 6.75L6 3.75h12l2.25 3',
    Mesas:
      'M3.75 9h16.5M3.75 9v8.25A2.25 2.25 0 006 19.5h12a2.25 2.25 0 002.25-2.25V9M3.75 9l1.5-4.5h13.5l1.5 4.5M8.25 13.5v4.5M15.75 13.5v4.5',
    Inventario:
      'M20.25 7.5l-8.25-4.5L3.75 7.5m16.5 0l-8.25 4.5m8.25-4.5v9l-8.25 4.5m0-9L3.75 7.5m8.25 4.5v9M3.75 7.5v9l8.25 4.5',
    Pagos:
      'M2.25 8.25h19.5M2.25 8.25v9A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25v-9M2.25 8.25l1.5-3.75A2.25 2.25 0 015.86 3h12.28a2.25 2.25 0 012.11 1.5l1.5 3.75M6 15.75h3',
    Usuarios:
      'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0112.728 0zM15 16.125a4.125 4.125 0 10-7.533 2.493M15 16.125a4.125 4.125 0 00-7.533 2.493M8.25 9.75a3 3 0 116 0 3 3 0 01-6 0z',
    Reservaciones:
      'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    PortalCliente:
      'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
    Empleados:
      'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-5.13a4 4 0 110-8 4 4 0 010 8zm6 0a3 3 0 100-6 3 3 0 000 6z',
    Reporte:
      'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  };

  private static readonly ROLE_LINKS: Record<string, SidebarLink[]> = {
    administrador: [
      { label: 'Dashboard', link: '/admin/dashboard', icon: 'Dashboard' },
      { label: 'Portal Cliente', link: '/cliente/dashboard', icon: 'PortalCliente' },
      { label: 'Administrar Negocio', link: '/pages/business-warning', icon: 'Negocio' },
      { label: 'Pedidos', link: '/pages/order', icon: 'Pedidos' },
      { label: 'Mesas', link: '/pages/restaurant-table', icon: 'Mesas' },
      { label: 'Inventario', link: '/pages/inventory', icon: 'Inventario' },
      { label: 'Pagos', link: '/pages/payment', icon: 'Pagos' },
      { label: 'Usuarios', link: '/pages/user', icon: 'Usuarios' },
    ],
    cajero: [
      { label: 'Dashboard', link: '/cajero/dashboard', icon: 'Dashboard' },
      { label: 'Pedidos', link: '/pages/order', icon: 'Pedidos' },
      { label: 'Pagos', link: '/pages/payment', icon: 'Pagos' },
      { label: 'Reporte', link: '/cajero/reporte', icon: 'Reporte' },
    ],
    chef: [
      { label: 'Dashboard', link: '/chef/dashboard', icon: 'Dashboard' },
      { label: 'Inventario', link: '/pages/inventory', icon: 'Inventario' },
      { label: 'Pedidos', link: '/pages/order', icon: 'Pedidos' },
    ],
    mesero: [
      { label: 'Dashboard', link: '/mesero/dashboard', icon: 'Dashboard' },
      { label: 'Pedidos', link: '/pages/order', icon: 'Pedidos' },
      { label: 'Mesas', link: '/pages/restaurant-table', icon: 'Mesas' },
      { label: 'Reservaciones', link: '/pages/reservation', icon: 'Reservaciones' },
    ],
    cliente: [
      { label: 'Mi Portal', link: '/cliente/dashboard', icon: 'PortalCliente' },
      { label: 'Reservaciones', link: '/pages/reservation', icon: 'Reservaciones' },
      { label: 'Pedidos', link: '/pages/order', icon: 'Pedidos' },
    ],
  };

  private static readonly DEFAULT_LINKS: SidebarLink[] = [
    { label: 'Administrar Negocio', link: '/pages/business-warning', icon: 'Negocio' },
  ];

  readonly currentUser = this.authService.currentUser;
  readonly userName = computed(() => this.currentUser()?.username ?? 'Usuario');
  readonly userRole = computed(() => this.currentUser()?.role?.name ?? '');
  readonly userInitial = computed(() => this.userName().charAt(0).toUpperCase());

  readonly links = computed<SidebarLink[]>(() => {
    const role = this.userRole().toLowerCase();
    return SidebarComponent.ROLE_LINKS[role] ?? SidebarComponent.DEFAULT_LINKS;
  });

  constructor() {
    if (!this.currentUser()) {
      this.authService.fetchCurrentUser().subscribe({ error: () => {} });
    }
  }

  iconPath(icon: string): string {
    return SidebarComponent.ICONS[icon] ?? SidebarComponent.ICONS['Dashboard'];
  }

  readonly showLogoutModal = signal(false);

  confirmLogout(): void {
    this.showLogoutModal.set(true);
  }

  cancelLogout(): void {
    this.showLogoutModal.set(false);
  }

  logout(): void {
    this.showLogoutModal.set(false);
    this.loginService.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout(): void {
    sessionStorage.removeItem(environment.TOKEN_NAME);
    this.authService.clearCurrentUser();
    this.router.navigate(['/login']);
  }
}
