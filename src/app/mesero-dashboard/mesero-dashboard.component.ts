import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
import { OrderService } from '../services/order.service';
import { RestaurantTableService } from '../services/restauranttable.service';
import { Order } from '../model/order';

function isToday(dateStr: string): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

function isSameDay(dateStr: string, reference: Date): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return (
    d.getFullYear() === reference.getFullYear() &&
    d.getMonth() === reference.getMonth() &&
    d.getDate() === reference.getDate()
  );
}

const DAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const FINAL_STATUSES = ['ENTREGADO', 'PAGADO', 'CANCELADO'];

// Refresco periodico para reflejar cambios de cocina/caja hechos desde otra sesion.
const REFRESH_INTERVAL_MS = 8000;

@Component({
  selector: 'app-mesero-dashboard',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterLink],
  templateUrl: './mesero-dashboard.component.html',
})
export class MeseroDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly tableService = inject(RestaurantTableService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentUser = this.authService.currentUser;
  readonly userName = computed(() => this.currentUser()?.username ?? 'Mesero');

  private readonly orders = this.orderService.$listChange;
  private readonly tables = this.tableService.$listChange;

  private readonly ordersToday = computed(() => this.orders().filter((o) => isToday(o.orderDate)));

  readonly pedidosAtendidosHoy = computed(
    () => this.ordersToday().filter((o) => o.status !== 'CANCELADO').length,
  );

  readonly mesasActivas = computed(() => this.tables().filter((t) => t.status === 'OCUPADA').length);
  readonly mesasReservadas = computed(() => this.tables().filter((t) => t.status === 'RESERVADA').length);

  readonly distribucionMesas = computed(() => {
    const total = this.tables().length;
    if (!total) return { disponible: 0, ocupada: 0, reservada: 0 };
    const ocupada = this.mesasActivas();
    const reservada = this.mesasReservadas();
    const disponible = total - ocupada - reservada;
    return {
      disponible: Math.round((disponible / total) * 100),
      ocupada: Math.round((ocupada / total) * 100),
      reservada: Math.round((reservada / total) * 100),
    };
  });

  readonly mesasChartGradient = computed(() => {
    const { disponible, ocupada } = this.distribucionMesas();
    const d = disponible * 3.6;
    const o = ocupada * 3.6;
    return `conic-gradient(#22c55e 0deg ${d}deg, var(--brand-700) ${d}deg ${d + o}deg, #fcd34d ${d + o}deg 360deg)`;
  });

  // Pedidos aún activos hoy (no entregados/cobrados/cancelados): tiempo de espera promedio actual.
  readonly tiempoPromedioEspera = computed(() => {
    const activos = this.ordersToday().filter((o) => !FINAL_STATUSES.includes(o.status));
    if (!activos.length) return 0;
    const now = Date.now();
    const totalMin = activos.reduce((sum, o) => sum + (now - new Date(o.orderDate).getTime()) / 60000, 0);
    return Math.round(totalMin / activos.length);
  });

  readonly pedidosListosParaEntregar = computed(() => this.orders().filter((o) => o.status === 'LISTO'));

  // Gráfico de barras: Pedidos por día (últimos 7 días)
  readonly pedidosPorDia = computed(() => {
    const result: { label: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const total = this.orders().filter(
        (o) => o.status !== 'CANCELADO' && isSameDay(o.orderDate, day),
      ).length;
      result.push({ label: DAY_LABELS[day.getDay()], total });
    }
    return result;
  });

  readonly pedidosPorDiaMax = computed(() => Math.max(...this.pedidosPorDia().map((d) => d.total), 1));

  readonly entregandoIds = new Set<number>();

  /** Pedido pendiente de confirmar entrega (null = modal cerrado). */
  readonly orderToDeliver = signal<Order | null>(null);

  constructor() {
    if (!this.currentUser()) {
      this.authService.fetchCurrentUser().subscribe({ error: () => {} });
    }

    this.load();

    const intervalId = setInterval(() => this.load(), REFRESH_INTERVAL_MS);
    this.destroyRef.onDestroy(() => clearInterval(intervalId));
  }

  private load(): void {
    this.orderService.findAll().subscribe((data) => this.orderService.setListChange(data));
    this.tableService.findAll().subscribe((data) => this.tableService.setListChange(data));
  }

  askDeliverConfirmation(order: Order): void {
    this.orderToDeliver.set(order);
  }

  cancelDeliver(): void {
    this.orderToDeliver.set(null);
  }

  confirmDeliver(): void {
    const order = this.orderToDeliver();
    this.orderToDeliver.set(null);
    if (order) this.entregar(order);
  }

  private entregar(order: Order): void {
    const id = order.idOrder!;
    if (this.entregandoIds.has(id)) return;
    this.entregandoIds.add(id);
    this.orderService.update(id, { ...order, status: 'ENTREGADO' }).subscribe({
      next: () => this.load(),
      error: () => this.entregandoIds.delete(id),
      complete: () => this.entregandoIds.delete(id),
    });
  }
}
