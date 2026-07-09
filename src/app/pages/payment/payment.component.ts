import { Component, DestroyRef, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Payment } from '../../model/payment';
import { PaymentService } from '../../services/payment.service';
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
import { BackToHomeComponent } from '../../shared/back-to-home/back-to-home.component';

// Refresco periodico para reflejar pedidos LISTO recien marcados por cocina.
const REFRESH_INTERVAL_MS = 8000;

@Component({
  selector: 'app-payment',
  imports: [
    BackToHomeComponent,
    MatTableModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatButtonModule,
    MatIconModule, RouterLink, RouterOutlet, MatSnackBarModule, DatePipe, DecimalPipe,
  ],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent {

  private readonly service = inject(PaymentService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  protected $dataSource = signal(new MatTableDataSource<Payment>());
  protected $sort = viewChild(MatSort);
  protected $items = this.service.$listChange;
  protected readonly pageable = new PageableSearch<Payment>(
    (page, size) => this.service.findAllPageable(page, size),
    () => this.$items(),
  );
  protected displayedColumns = ['idPayment', 'order', 'paymentDate', 'amount', 'paymentMethod', 'status', 'actions'];

  constructor() {
    this.service.findAll().subscribe(data => this.service.setListChange(data));
    this.pageable.loadServerPage();

    const intervalId = setInterval(() => {
      this.service.findAll().subscribe(data => this.service.setListChange(data));
      this.pageable.loadServerPage();
    }, REFRESH_INTERVAL_MS);
    this.destroyRef.onDestroy(() => clearInterval(intervalId));

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
    if (window.confirm('¿Eliminar este pago?')) {
      this.service.delete(id).pipe(
        switchMap(() => this.service.findAll()),
        tap(data => this.service.setListChange(data)),
        tap(() => this.service.setMessageChange('DELETED')),
        tap(() => this.pageable.loadServerPage()),
      ).subscribe();
    }
  }
}
