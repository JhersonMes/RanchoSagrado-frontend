import { Component, DestroyRef, effect, inject, signal, untracked, viewChild, computed } from '@angular/core';
import { Order } from '../../model/order';
import { OrderService } from '../../services/order.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe, DecimalPipe } from '@angular/common';
import { switchMap, tap } from 'rxjs';
import { PageableSearch } from '../../shared/pageable-search';
import { AuthService } from '../../services/auth.service';

// Refresco periodico para que los cambios de estado hechos por otro rol
// (mesero crea, cocina prepara, cajero cobra) se reflejen sin recargar la pagina.
const REFRESH_INTERVAL_MS = 8000;

@Component({
  selector: 'app-order',
  imports: [
    MatTableModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatButtonModule,
    MatIconModule, RouterLink, RouterOutlet, MatSnackBarModule, DatePipe, DecimalPipe,
  ],
  templateUrl: './order.component.html',
  styleUrl: './order.component.css',
})
export class OrderComponent {

  private readonly service = inject(OrderService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);

  protected readonly isMesero = computed(() => this.authService.roleName().toLowerCase().includes('mesero'));

  protected $dataSource = signal(new MatTableDataSource<Order>());
  protected $sort = viewChild(MatSort);
  protected $items = this.service.$listChange;
  protected readonly pageable = new PageableSearch<Order>(
    (page, size) => this.service.findAllPageable(page, size),
    () => this.$items(),
  );
  protected displayedColumns = ['idOrder', 'orderDate', 'employee', 'client', 'restaurantTable', 'total', 'status', 'actions'];

  constructor() {
    this.service.findAll().subscribe(data => this.service.setListChange(data));
    this.pageable.loadServerPage();

    // Mantiene la lista al dia si otro rol (cocina, cajero) cambia el estado de un pedido.
    const intervalId = setInterval(() => {
      this.service.findAll().subscribe(data => this.service.setListChange(data));
      this.pageable.loadServerPage();
    }, REFRESH_INTERVAL_MS);
    this.destroyRef.onDestroy(() => clearInterval(intervalId));

    effect(() => {
      const ds = this.$dataSource();
      let data = this.pageable.data();
      if (this.isMesero()) {
        data = data.filter((o) => o.status !== 'PAGADO');
      }
      ds.data = data;
      ds.sort = this.$sort();
    });

    effect(() => {
      const msg = this.service.$messageChange();
      if (msg) {
        this.snackBar.open(msg, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.service.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    this.pageable.applyFilter(e.target.value as string);
  }

  delete(id: number) {
    if (window.confirm('¿Eliminar este pedido?')) {
      this.service.delete(id).pipe(
        switchMap(() => this.service.findAll()),
        tap(data => this.service.setListChange(data)),
        tap(() => this.service.setMessageChange('DELETED')),
        tap(() => this.pageable.loadServerPage()),
      ).subscribe();
    }
  }

  // Cambio rápido de estado (cocina): PENDIENTE → EN_PROCESO → LISTO
  updateStatus(row: Order, status: string) {
    if (!row.idOrder) return;
    this.service.update(row.idOrder, { ...row, status }).pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(`PEDIDO #${row.idOrder} → ${status}`)),
      tap(() => this.pageable.loadServerPage()),
    ).subscribe();
  }
}
