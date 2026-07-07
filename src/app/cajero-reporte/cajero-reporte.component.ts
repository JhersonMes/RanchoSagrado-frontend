import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
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

function isSameDate(dateStr: string, ref: string): boolean {
  if (!dateStr || !ref) return false;
  return dateStr.startsWith(ref);
}

const REFRESH_INTERVAL_MS = 10000;

@Component({
  selector: 'app-cajero-reporte',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, CurrencyPipe],
  templateUrl: './cajero-reporte.component.html',
})
export class CajeroReporteComponent {
  private readonly authService = inject(AuthService);
  private readonly paymentService = inject(PaymentService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentUser = this.authService.currentUser;
  private readonly payments = this.paymentService.$listChange;

  // Filtro de fecha: por defecto hoy
  readonly fechaFiltro = signal<string>(new Date().toISOString().substring(0, 10));

  readonly cobrosDelDia = computed(() => {
    const fecha = this.fechaFiltro();
    return this.payments()
      .filter((p) => p.status === 'PAGADO' && isSameDate(p.paymentDate, fecha))
      .map((p) => ({
        idPayment: p.idPayment,
        mesa: p.order?.restaurantTable?.tableNumber ?? '-',
        cliente: p.order?.client?.name
          ? `${p.order.client.name} ${p.order.client.lastName ?? ''}`.trim()
          : 'Sin cliente',
        hora: new Date(p.paymentDate).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
        metodo: p.paymentMethod ?? '-',
        monto: Number(p.amount ?? 0),
        pedidoId: p.order?.idOrder ?? '-',
      }))
      .sort((a, b) => a.hora.localeCompare(b.hora));
  });

  readonly totalCobrado = computed(() =>
    this.cobrosDelDia().reduce((sum, c) => sum + c.monto, 0)
  );

  readonly totalEfectivo = computed(() =>
    this.cobrosDelDia()
      .filter((c) => c.metodo === 'EFECTIVO')
      .reduce((sum, c) => sum + c.monto, 0)
  );

  readonly totalTarjeta = computed(() =>
    this.cobrosDelDia()
      .filter((c) => c.metodo === 'TARJETA')
      .reduce((sum, c) => sum + c.monto, 0)
  );

  readonly cantidadMesas = computed(() => this.cobrosDelDia().length);

  // Texto del día seleccionado
  readonly labelFecha = computed(() => {
    const f = this.fechaFiltro();
    const hoy = new Date().toISOString().substring(0, 10);
    if (f === hoy) return 'Hoy';
    const d = new Date(f + 'T00:00:00');
    return d.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' });
  });

  setFecha(value: string) {
    this.fechaFiltro.set(value);
  }

  setHoy() {
    this.fechaFiltro.set(new Date().toISOString().substring(0, 10));
  }

  constructor() {
    if (!this.currentUser()) {
      this.authService.fetchCurrentUser().subscribe({ error: () => {} });
    }
    this.paymentService.findAll().subscribe((data) => this.paymentService.setListChange(data));

    const intervalId = setInterval(() => {
      this.paymentService.findAll().subscribe((data) => this.paymentService.setListChange(data));
    }, REFRESH_INTERVAL_MS);
    this.destroyRef.onDestroy(() => clearInterval(intervalId));
  }
}
