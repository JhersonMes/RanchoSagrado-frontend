import { Component, DestroyRef, computed, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
import { OrderService } from '../services/order.service';
import { PaymentService } from '../services/payment.service';

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

// Refresco periodico para reflejar pedidos que cocina marca LISTO desde otra sesion.
const REFRESH_INTERVAL_MS = 8000;

@Component({
  selector: 'app-cajero-dashboard',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CurrencyPipe, RouterLink],
  templateUrl: './cajero-dashboard.component.html',
})
export class CajeroDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly paymentService = inject(PaymentService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentUser = this.authService.currentUser;
  readonly userName = computed(() => this.currentUser()?.username ?? 'Cajero');

  private readonly orders = this.orderService.$listChange;
  private readonly payments = this.paymentService.$listChange;

  readonly ventasDiarias = computed(() =>
    this.payments()
      .filter((p) => p.status === 'PAGADO' && isToday(p.paymentDate))
      .reduce((sum, p) => sum + Number(p.amount ?? 0), 0)
  );

  private readonly pagosPendientesList = computed(() =>
    this.payments().filter((p) => p.status === 'PENDIENTE')
  );

  readonly pagosPendientes = computed(() =>
    this.pagosPendientesList().reduce((sum, p) => sum + Number(p.amount ?? 0), 0)
  );

  readonly mesasPendientes = computed(() => this.pagosPendientesList().length);

  readonly distribucionPagos = computed(() => {
    const pagados = this.payments().filter((p) => p.status === 'PAGADO');
    const total = pagados.length;
    if (!total) return { efectivo: 0, tarjeta: 0 };
    const efectivo = pagados.filter((p) => p.paymentMethod === 'EFECTIVO').length;
    const tarjeta = total - efectivo;
    return {
      efectivo: Math.round((efectivo / total) * 100),
      tarjeta: Math.round((tarjeta / total) * 100),
    };
  });

  readonly ordenesListasParaCobro = computed(() =>
    this.orders().filter((o) => o.status === 'ENTREGADO')
  );

  // Reporte: pagos PAGADO del día de hoy para el widget de cobros
  readonly mesasCobradas = computed(() => {
    return this.payments()
      .filter((p) => p.status === 'PAGADO' && isToday(p.paymentDate))
      .map((p) => ({
        idPayment: p.idPayment,
        mesa: p.order?.restaurantTable?.tableNumber ?? '-',
        hora: new Date(p.paymentDate).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
        metodo: p.paymentMethod ?? '-',
        monto: Number(p.amount ?? 0),
      }))
      .sort((a, b) => b.monto - a.monto);
  });


  // Gráfico de pastel: Pagos pendientes vs. Atendidos (PAGADO)
  readonly pagosAtendidosCount = computed(
    () => this.payments().filter((p) => p.status === 'PAGADO').length
  );

  readonly pagosPendientesCount = computed(
    () => this.pagosPendientesList().length
  );

  readonly pieChartData = computed(() => {
    const atendidos = this.pagosAtendidosCount();
    const pendientes = this.pagosPendientesCount();
    const total = atendidos + pendientes;
    if (!total) return { atendidosPct: 0, pendientesPct: 0, atendidosDeg: 0 };
    return {
      atendidosPct: Math.round((atendidos / total) * 100),
      pendientesPct: Math.round((pendientes / total) * 100),
      atendidosDeg: (atendidos / total) * 360,
    };
  });

  readonly pieChartGradient = computed(() => {
    const { atendidosDeg } = this.pieChartData();
    return `conic-gradient(var(--brand-700) 0deg ${atendidosDeg}deg, #fcd34d ${atendidosDeg}deg 360deg)`;
  });

  // Gráfico de barras: Ventas por día (últimos 7 días)
  readonly ventasPorDia = computed(() => {
    const result: { label: string; total: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const day = new Date();
      day.setDate(day.getDate() - i);
      const total = this.payments()
        .filter((p) => p.status === 'PAGADO' && isSameDay(p.paymentDate, day))
        .reduce((sum, p) => sum + Number(p.amount ?? 0), 0);
      result.push({ label: DAY_LABELS[day.getDay()], total });
    }
    return result;
  });

  readonly ventasPorDiaMax = computed(() =>
    Math.max(...this.ventasPorDia().map((d) => d.total), 1)
  );

  constructor() {
    if (!this.currentUser()) {
      this.authService.fetchCurrentUser().subscribe({ error: () => {} });
    }

    this.orderService.findAll().subscribe((data) => this.orderService.setListChange(data));
    this.paymentService.findAll().subscribe((data) => this.paymentService.setListChange(data));

    const intervalId = setInterval(() => {
      this.orderService.findAll().subscribe((data) => this.orderService.setListChange(data));
      this.paymentService.findAll().subscribe((data) => this.paymentService.setListChange(data));
    }, REFRESH_INTERVAL_MS);
    this.destroyRef.onDestroy(() => clearInterval(intervalId));
  }
}
