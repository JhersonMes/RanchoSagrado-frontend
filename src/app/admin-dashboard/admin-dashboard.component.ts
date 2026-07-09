import { Component, computed, inject } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
import { OrderService } from '../services/order.service';
import { RestaurantTableService } from '../services/restauranttable.service';
import { InventoryService } from '../services/inventory.service';
import { PaymentService } from '../services/payment.service';
import { EmployeeService } from '../services/employee.service';
import { ReservationService } from '../services/reservation.service';

const ACTIVE_ORDER_STATUSES = ['PENDIENTE', 'EN_PROCESO', 'LISTO', 'ENTREGADO'];

function isSameDay(dateStr: string, reference: Date): boolean {
  if (!dateStr) return false;
  const d = new Date(dateStr);
  return (
    d.getFullYear() === reference.getFullYear() &&
    d.getMonth() === reference.getMonth() &&
    d.getDate() === reference.getDate()
  );
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterLink, SidebarComponent, HeaderComponent, CurrencyPipe, DatePipe],
  templateUrl: './admin-dashboard.component.html',
})
export class AdminDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly tableService = inject(RestaurantTableService);
  private readonly inventoryService = inject(InventoryService);
  private readonly paymentService = inject(PaymentService);
  private readonly employeeService = inject(EmployeeService);
  private readonly reservationService = inject(ReservationService);

  readonly currentUser = this.authService.currentUser;
  readonly userName = computed(() => this.currentUser()?.username ?? 'Admin');

  private readonly orders = this.orderService.$listChange;
  private readonly tables = this.tableService.$listChange;
  private readonly inventory = this.inventoryService.$listChange;
  private readonly payments = this.paymentService.$listChange;
  private readonly employees = this.employeeService.$listChange;
  private readonly reservations = this.reservationService.$listChange;

  readonly ingresosTotales = computed(() =>
    this.payments()
      .filter((p) => p.status === 'PAGADO')
      .reduce((sum, p) => sum + Number(p.amount ?? 0), 0)
  );

  readonly ingresosHoy = computed(() => {
    const today = new Date();
    return this.payments()
      .filter((p) => p.status === 'PAGADO' && isSameDay(p.paymentDate, today))
      .reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
  });

  readonly ingresosAyer = computed(() => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.payments()
      .filter((p) => p.status === 'PAGADO' && isSameDay(p.paymentDate, yesterday))
      .reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
  });

  readonly ingresosVariacion = computed(() => {
    const ayer = this.ingresosAyer();
    if (!ayer) return this.ingresosHoy() > 0 ? 100 : 0;
    return Math.round(((this.ingresosHoy() - ayer) / ayer) * 1000) / 10;
  });

  readonly salesSeries = computed(() => {
    const series: number[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const total = this.payments()
        .filter((p) => p.status === 'PAGADO' && isSameDay(p.paymentDate, day))
        .reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
      series.push(total);
    }
    return series;
  });

  private readonly salesChartPoints = computed(() => {
    const series = this.salesSeries();
    const max = Math.max(...series, 0);
    const stepX = 100 / (series.length - 1);
    return series.map((v, i) => {
      const x = i * stepX;
      const y = max > 0 ? 28 - (v / max) * 24 : 28;
      return `${x},${y}`;
    });
  });

  readonly salesLinePath = computed(() => `M${this.salesChartPoints().join(' L')}`);

  readonly salesAreaPath = computed(() => {
    const pts = this.salesChartPoints();
    if (!pts.length) return '';
    return `M${pts.join(' L')} L100,30 L0,30 Z`;
  });

  readonly pedidosActivos = computed(() =>
    this.orders().filter((o) => ACTIVE_ORDER_STATUSES.includes(o.status)).length
  );

  readonly pedidosEnPreparacion = computed(
    () => this.orders().filter((o) => o.status === 'EN_PROCESO').length
  );

  readonly pedidosListos = computed(
    () => this.orders().filter((o) => o.status === 'LISTO').length
  );

  readonly ocupacionMesas = computed(() => {
    const total = this.tables().length;
    if (!total) return 0;
    const ocupadas = this.tables().filter((t) => t.status === 'OCUPADA').length;
    return Math.round((ocupadas / total) * 100);
  });

  readonly alertasInventario = computed(() =>
    this.inventory().filter((i) => i.stockQuantity <= i.minStock)
  );

  readonly reservacionesHoy = computed(() => {
    const today = new Date();
    return this.reservations().filter(
      (r) => r.status === 'CONFIRMADA' && isSameDay(r.reservationDate, today)
    ).length;
  });

  readonly mesasDisponibles = computed(
    () => this.tables().filter((t) => t.status === 'LIBRE').length
  );

  readonly cubiertosHoy = computed(() => {
    const today = new Date();
    return this.reservations()
      .filter((r) => r.status === 'CONFIRMADA' && isSameDay(r.reservationDate, today))
      .reduce((sum, r) => sum + Number(r.numberOfPeople ?? 0), 0);
  });

  readonly staffEnTurno = computed(() =>
    this.employees()
      .filter((e) => e.status === 'ACTIVO')
      .slice(0, 4)
  );

  readonly actividadReciente = computed(() => {
    const ordenes = this.orders().map((o) => ({
      label: `Pedido #${o.idOrder} · ${o.status}`,
      date: new Date(o.orderDate),
    }));
    const reservas = this.reservations().map((r) => ({
      label: `Reserva ${r.status.toLowerCase()} · ${r.client?.name ?? 'Cliente'}`,
      date: new Date(r.reservationDate),
    }));
    return [...ordenes, ...reservas]
      .filter((a) => !isNaN(a.date.getTime()))
      .sort((a, b) => b.date.getTime() - a.date.getTime())
      .slice(0, 5);
  });

  staffInitial(name: string): string {
    return (name ?? '').charAt(0).toUpperCase();
  }

  constructor() {
    if (!this.currentUser()) {
      this.authService.fetchCurrentUser().subscribe({ error: () => {} });
    }

    this.orderService.findAll().subscribe((data) => this.orderService.setListChange(data));
    this.tableService.findAll().subscribe((data) => this.tableService.setListChange(data));
    this.inventoryService.findAll().subscribe((data) => this.inventoryService.setListChange(data));
    this.paymentService.findAll().subscribe((data) => this.paymentService.setListChange(data));
    this.employeeService.findAll().subscribe((data) => this.employeeService.setListChange(data));
    this.reservationService.findAll().subscribe((data) => this.reservationService.setListChange(data));
  }
}
