import { Component, computed, effect, inject, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../shared/header/header.component';
import { ProductService } from '../services/product.service';
import { PromotionService } from '../services/promotion.service';
import { OrderService } from '../services/order.service';
import { Product } from '../model/product';

@Component({
  selector: 'app-cliente-dashboard',
  standalone: true,
  imports: [RouterLink, SidebarComponent, HeaderComponent, CurrencyPipe, DatePipe],
  templateUrl: './cliente-dashboard.component.html',
})
export class ClienteDashboardComponent {
  private readonly router = inject(Router);
  protected readonly authService = inject(AuthService);
  protected readonly productService = inject(ProductService);
  protected readonly promotionService = inject(PromotionService);
  protected readonly orderService = inject(OrderService);

  protected readonly userName = computed(
    () => this.authService.currentUser()?.username ?? 'Cliente',
  );

  // Carousel state
  protected readonly promoIndex = signal(0);
  protected readonly productPage = signal(0);
  readonly PRODUCTS_PER_PAGE = 4;

  protected readonly promotions = computed(() => this.promotionService.$listChange());
  protected readonly products = computed(() =>
    this.productService.$listChange().filter((p) => p.availability),
  );
  protected readonly recentOrders = computed(() =>
    [...this.orderService.$listChange()].reverse().slice(0, 5),
  );

  protected readonly productPages = computed(
    () => Math.ceil(this.products().length / this.PRODUCTS_PER_PAGE) || 1,
  );
  protected readonly visibleProducts = computed(() => {
    const start = this.productPage() * this.PRODUCTS_PER_PAGE;
    return this.products().slice(start, start + this.PRODUCTS_PER_PAGE);
  });

  protected readonly currentPromo = computed(() => {
    const list = this.promotions();
    if (!list.length) return null;
    return list[this.promoIndex() % list.length];
  });

  // Reservation quick-form
  protected reservationDate = signal('');
  protected reservationTime = signal('');
  protected reservationPeople = signal('2');

  constructor() {
    this.productService.findAll().subscribe((d) => this.productService.setListChange(d));
    this.promotionService.findAll().subscribe((d) => this.promotionService.setListChange(d));
    this.orderService.findAll().subscribe((d) => this.orderService.setListChange(d));
  }

  prevPromo(): void {
    const len = this.promotions().length;
    if (!len) return;
    this.promoIndex.update((i) => (i - 1 + len) % len);
  }

  nextPromo(): void {
    const len = this.promotions().length;
    if (!len) return;
    this.promoIndex.update((i) => (i + 1) % len);
  }

  setPromoIndex(i: number): void {
    this.promoIndex.set(i);
  }

  prevProducts(): void {
    this.productPage.update((p) => Math.max(0, p - 1));
  }

  nextProducts(): void {
    this.productPage.update((p) => Math.min(this.productPages() - 1, p + 1));
  }

  orderProduct(product: Product): void {
    this.router.navigate(['/pages/order/new'], { state: { preselectedProduct: product } });
  }

  goToReservation(): void {
    const params: Record<string, string> = {};
    if (this.reservationDate() && this.reservationTime())
      params['date'] = `${this.reservationDate()}T${this.reservationTime()}`;
    if (this.reservationPeople()) params['people'] = this.reservationPeople();
    this.router.navigate(['/pages/reservation/new'], { queryParams: params });
  }

  statusClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'ENTREGADO':
        return 'bg-green-100 text-green-700';
      case 'PENDIENTE':
        return 'bg-amber-100 text-amber-700';
      case 'EN_PROCESO':
        return 'bg-blue-100 text-blue-700';
      case 'LISTO':
        return 'bg-purple-100 text-purple-700';
      case 'CANCELADO':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  }
}
