import { Component, ElementRef, HostListener, Input, OnDestroy, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';
import { OrderService } from '../../services/order.service';
import { ReservationService } from '../../services/reservation.service';
import { InventoryService } from '../../services/inventory.service';
import { environment } from '../../../environments/environment.development';

interface SearchableFeature {
  label: string;
  link: string;
  icon: string;
}

interface AppNotification {
  id: string;
  message: string;
  date: Date;
}

const NOTIFICATIONS_ENABLED_KEY = 'notificationsEnabled';
const POLL_INTERVAL_MS = 20000;

const FEATURES: SearchableFeature[] = [
  { label: 'Dashboard', link: '/admin/dashboard', icon: 'Dashboard' },
  { label: 'Administrar Negocio', link: '/pages/business-warning', icon: 'Negocio' },
  { label: 'Pedidos', link: '/pages/order', icon: 'Pedidos' },
  { label: 'Mesas', link: '/pages/restaurant-table', icon: 'Mesas' },
  { label: 'Inventario', link: '/pages/inventory', icon: 'Inventario' },
  { label: 'Pagos', link: '/pages/payment', icon: 'Pagos' },
  { label: 'Comprobantes de Pago', link: '/pages/payment-receipt', icon: 'Pagos' },
  { label: 'Usuarios', link: '/pages/user', icon: 'Usuarios' },
  { label: 'Empleados', link: '/pages/employee', icon: 'Empleados' },
  { label: 'Turnos', link: '/pages/shift', icon: 'Empleados' },
  { label: 'Clientes', link: '/pages/client', icon: 'Usuarios' },
  { label: 'Proveedores', link: '/pages/supplier', icon: 'Usuarios' },
  { label: 'Roles', link: '/pages/role', icon: 'Usuarios' },
  { label: 'Reservaciones', link: '/pages/reservation', icon: 'Reservaciones' },
  { label: 'Contratos', link: '/pages/contract', icon: 'Pagos' },
  { label: 'Ingredientes', link: '/pages/ingredient', icon: 'Inventario' },
  { label: 'Categorías de Ingrediente', link: '/pages/ingredient-category', icon: 'Inventario' },
  { label: 'Cartas / Menús', link: '/pages/menu', icon: 'Pedidos' },
  { label: 'Productos', link: '/pages/product', icon: 'Pedidos' },
  { label: 'Categorías de Producto', link: '/pages/product-category', icon: 'Pedidos' },
  { label: 'Promociones', link: '/pages/promotion', icon: 'Pagos' },
];

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent implements OnDestroy {
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
    Reservaciones: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
    Empleados:
      'M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-5.13a4 4 0 110-8 4 4 0 010 8zm6 0a3 3 0 100-6 3 3 0 000 6z',
  };

  @Input() title = 'Rancho Sagrado';
  @Input() searchPlaceholder = 'Buscar...';

  private readonly authService = inject(AuthService);
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);
  private readonly orderService = inject(OrderService);
  private readonly reservationService = inject(ReservationService);
  private readonly inventoryService = inject(InventoryService);

  readonly currentUser = this.authService.currentUser;
  readonly userName = computed(() => this.currentUser()?.username ?? 'Usuario');
  readonly userRole = computed(() => this.currentUser()?.role?.name ?? '');
  readonly userInitial = computed(() => this.userName().charAt(0).toUpperCase());

  readonly searchTerm = signal('');
  readonly showResults = signal(false);

  readonly results = computed<SearchableFeature[]>(() => {
    const term = this.searchTerm().trim().toLowerCase();
    if (!term) return [];
    return FEATURES.filter((f) => f.label.toLowerCase().includes(term)).slice(0, 8);
  });

  readonly showProfileMenu = signal(false);
  readonly showSettingsModal = signal(false);
  readonly showLogoutModal = signal(false);
  readonly notificationsEnabled = signal(this.readNotificationsEnabled());

  readonly showNotifications = signal(false);
  readonly notifications = signal<AppNotification[]>([]);
  readonly unreadCount = computed(() => this.notifications().length);

  private knownOrderIds = new Set<number>();
  private knownReservationIds = new Set<number>();
  private knownInventoryAlertIds = new Set<number>();
  private firstPoll = true;

  private intervalId: any;

  constructor() {
    this.pollForChanges();
    this.intervalId = setInterval(() => this.pollForChanges(), POLL_INTERVAL_MS);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private readNotificationsEnabled(): boolean {
    return localStorage.getItem(NOTIFICATIONS_ENABLED_KEY) !== 'false';
  }

  private pollForChanges() {
    this.orderService.findAll().subscribe((orders) => {
      const isFirst = this.firstPoll;
      for (const o of orders) {
        if (o.idOrder == null) continue;
        if (!this.knownOrderIds.has(o.idOrder)) {
          this.knownOrderIds.add(o.idOrder);
          if (!isFirst && this.notificationsEnabled()) {
            this.pushNotification(`Nuevo pedido #${o.idOrder} recibido`);
          }
        }
      }
    });

    this.reservationService.findAll().subscribe((reservations) => {
      const isFirst = this.firstPoll;
      for (const r of reservations) {
        if (r.idReservation == null) continue;
        if (!this.knownReservationIds.has(r.idReservation)) {
          this.knownReservationIds.add(r.idReservation);
          if (!isFirst && this.notificationsEnabled()) {
            this.pushNotification(`Nueva reservación de ${r.client?.name ?? 'un cliente'}`);
          }
        }
      }
    });

    this.inventoryService.findAll().subscribe((items) => {
      const isFirst = this.firstPoll;
      for (const i of items) {
        if (i.idInventory == null) continue;
        const isLow = i.stockQuantity <= i.minStock;
        if (isLow && !this.knownInventoryAlertIds.has(i.idInventory)) {
          this.knownInventoryAlertIds.add(i.idInventory);
          if (!isFirst && this.notificationsEnabled()) {
            this.pushNotification(`Stock bajo: ${i.ingredient?.name ?? 'ingrediente'}`);
          }
        } else if (!isLow) {
          this.knownInventoryAlertIds.delete(i.idInventory);
        }
      }
    });

    this.firstPoll = false;
  }

  private pushNotification(message: string) {
    this.notifications.update((list) => [{ id: `${Date.now()}-${message}`, message, date: new Date() }, ...list].slice(0, 20));
  }

  onSearchInput(value: string) {
    this.searchTerm.set(value);
    this.showResults.set(value.trim().length > 0);
  }

  selectResult(feature: SearchableFeature) {
    this.router.navigateByUrl(feature.link);
    this.searchTerm.set('');
    this.showResults.set(false);
  }

  iconPath(icon: string): string {
    return HeaderComponent.ICONS[icon] ?? HeaderComponent.ICONS['Dashboard'];
  }

  toggleNotifications() {
    this.showNotifications.update((v) => !v);
    this.showProfileMenu.set(false);
  }

  clearNotifications() {
    this.notifications.set([]);
  }

  toggleProfileMenu() {
    this.showProfileMenu.update((v) => !v);
    this.showNotifications.set(false);
  }

  openSettings() {
    this.showProfileMenu.set(false);
    this.showSettingsModal.set(true);
  }

  closeSettings() {
    this.showSettingsModal.set(false);
  }

  toggleNotificationsEnabled() {
    const next = !this.notificationsEnabled();
    this.notificationsEnabled.set(next);
    localStorage.setItem(NOTIFICATIONS_ENABLED_KEY, String(next));
  }

  confirmLogout() {
    this.showProfileMenu.set(false);
    this.showLogoutModal.set(true);
  }

  cancelLogout() {
    this.showLogoutModal.set(false);
  }

  logout() {
    this.showLogoutModal.set(false);
    this.loginService.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout() {
    sessionStorage.removeItem(environment.TOKEN_NAME);
    this.authService.clearCurrentUser();
    this.router.navigate(['/login']);
  }

  @HostListener('document:click', ['$event'])
  onHostClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showResults.set(false);
      this.showProfileMenu.set(false);
      this.showNotifications.set(false);
    }
  }
}
