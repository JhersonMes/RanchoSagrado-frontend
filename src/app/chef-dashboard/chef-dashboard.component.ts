import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
import { OrderService } from '../services/order.service';
import { Order } from '../model/order';
import { tap } from 'rxjs';

/** Cuántos ms han pasado desde la fecha dada, formateado como "Xm Ys" */
function timeAgo(dateStr: string): string {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return `${diff}s`;
  const m = Math.floor(diff / 60);
  const s = diff % 60;
  if (m < 60) return `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

const REFRESH_MS = 8_000;

interface OrderCard {
  order: Order;
  timeAgo: string;
  urgent: boolean; // más de 15 min en espera
}

@Component({
  selector: 'app-chef-dashboard',
  standalone: true,
  imports: [CommonModule, SidebarComponent, HeaderComponent, DecimalPipe],
  templateUrl: './chef-dashboard.component.html',
  styleUrl: './chef-dashboard.component.css',
})
export class ChefDashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentUser = this.authService.currentUser;
  readonly userName = computed(() => this.currentUser()?.username ?? 'Chef');

  /** IDs de pedidos en proceso de cambio de estado (para deshabilitar botones) */
  readonly processingIds = signal<Set<number>>(new Set());

  /** Timestamp reactivo para actualizar el tiempo transcurrido cada segundo */
  private readonly tick = signal(Date.now());

  readonly pendingOrders = computed<OrderCard[]>(() => {
    this.tick(); // dependency para re-evaluar cada segundo
    return this.orderService
      .$listChange()
      .filter((o) => o.status === 'PENDIENTE')
      .sort((a, b) => new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime())
      .map((o) => {
        const diffSec = (Date.now() - new Date(o.orderDate).getTime()) / 1000;
        return {
          order: o,
          timeAgo: timeAgo(o.orderDate),
          urgent: diffSec > 15 * 60, // más de 15 min → urgente
        };
      });
  });

  readonly totalPendiente = computed(() => this.pendingOrders().length);

  constructor() {
    if (!this.currentUser()) {
      this.authService.fetchCurrentUser().subscribe({ error: () => {} });
    }
    this.load();

    // Refresco de datos cada 8 s
    const dataInterval = setInterval(() => this.load(), REFRESH_MS);
    // Refresco del reloj cada segundo para actualizar tiempos
    const clockInterval = setInterval(() => this.tick.set(Date.now()), 1_000);

    this.destroyRef.onDestroy(() => {
      clearInterval(dataInterval);
      clearInterval(clockInterval);
    });
  }

  private load(): void {
    this.orderService.findAll().subscribe((data) => this.orderService.setListChange(data));
  }

  markListo(order: Order): void {
    const id = order.idOrder!;
    this.addProcessing(id);
    this.orderService
      .patch(id, { status: 'LISTO' } as Partial<Order>)
      .pipe(tap(() => this.load()))
      .subscribe({ error: () => {} })
      .add(() => this.removeProcessing(id));
  }

  markCancelado(order: Order): void {
    const id = order.idOrder!;
    this.addProcessing(id);
    this.orderService
      .patch(id, { status: 'CANCELADO' } as Partial<Order>)
      .pipe(tap(() => this.load()))
      .subscribe({ error: () => {} })
      .add(() => this.removeProcessing(id));
  }

  isProcessing(id: number): boolean {
    return this.processingIds().has(id);
  }

  private addProcessing(id: number): void {
    this.processingIds.update((s) => new Set([...s, id]));
  }

  private removeProcessing(id: number): void {
    this.processingIds.update((s) => {
      const next = new Set(s);
      next.delete(id);
      return next;
    });
  }

  tableLabel(order: Order): string {
    return order.restaurantTable
      ? `Mesa #${(order.restaurantTable as any).tableNumber}`
      : 'Sin mesa';
  }

  clientLabel(order: Order): string {
    const c = order.client as any;
    return c ? `${c.name ?? ''} ${c.lastName ?? ''}`.trim() : 'Sin cliente';
  }
}
