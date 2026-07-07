import { Component, effect, inject, signal, untracked, viewChild, computed } from '@angular/core';
import { RestaurantTable } from '../../model/restauranttable';
import { RestaurantTableService } from '../../services/restauranttable.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';
import { PageableSearch } from '../../shared/pageable-search';
import { AuthService } from '../../services/auth.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../model/order';
import { Router } from '@angular/router';

@Component({
  selector: 'app-restaurant-table',
  imports: [
    MatTableModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatButtonModule,
    MatIconModule, RouterLink, RouterOutlet, MatSnackBarModule
  ],
  templateUrl: './restaurant-table.component.html',
  styleUrl: './restaurant-table.component.css',
})
export class RestaurantTableComponent {

  private readonly service = inject(RestaurantTableService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);
  private readonly orderService = inject(OrderService);
  private readonly router = inject(Router);

  protected readonly isGridMode = computed(() => !this.authService.roleName().toLowerCase().includes('admin'));

  protected readonly activeOrders = computed(() => {
    return this.orderService.$listChange().filter(o => o.status !== 'PAGADO' && o.status !== 'CANCELADO');
  });

  protected readonly tablesWithStatus = computed(() => {
    const allTables = this.service.$listChange();
    const active = this.activeOrders();
    return allTables.map(t => {
      const activeOrder = active.find(o => o.restaurantTable?.idTable === t.idTable);
      return {
        table: t,
        activeOrder: activeOrder,
        isOccupied: !!activeOrder
      };
    });
  });

  protected $dataSource = signal(new MatTableDataSource<RestaurantTable>());
  protected $sort = viewChild(MatSort);
  protected $items = this.service.$listChange;
  protected readonly pageable = new PageableSearch<RestaurantTable>(
    (page, size) => this.service.findAllPageable(page, size),
    () => this.$items(),
  );
  protected displayedColumns = ['idTable', 'tableNumber', 'capacity', 'location', 'status', 'actions'];

  constructor() {
    this.service.findAll().subscribe(data => this.service.setListChange(data));
    this.orderService.findAll().subscribe(data => this.orderService.setListChange(data));
    this.pageable.loadServerPage();

    // Refresco periódico para mesas
    setInterval(() => {
       this.service.findAll().subscribe(data => this.service.setListChange(data));
       this.orderService.findAll().subscribe(data => this.orderService.setListChange(data));
    }, 8000);

    effect(() => {
      const ds = this.$dataSource();
      ds.data = this.pageable.data();
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
    if (window.confirm('¿Eliminar esta mesa?')) {
      this.service.delete(id).pipe(
        switchMap(() => this.service.findAll()),
        tap(data => this.service.setListChange(data)),
        tap(() => this.service.setMessageChange('DELETED')),
        tap(() => this.pageable.loadServerPage()),
      ).subscribe();
    }
  }

  handleTableClick(tableStatus: any) {
    if (tableStatus.isOccupied && tableStatus.activeOrder) {
      this.router.navigate(['/pages/order/edit', tableStatus.activeOrder.idOrder]);
    } else {
      this.router.navigate(['/pages/order/new'], { state: { preselectedTable: tableStatus.table } });
    }
  }
}
