import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { PaymentReceipt } from '../../model/paymentreceipt';
import { PaymentReceiptService } from '../../services/paymentreceipt.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe, DecimalPipe } from '@angular/common';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-payment-receipt',
  imports: [
    MatTableModule, MatPaginatorModule, MatSortModule,
    MatIconModule, RouterLink, RouterOutlet, MatSnackBarModule, DatePipe, DecimalPipe,
  ],
  templateUrl: './payment-receipt.component.html',
  styleUrl: './payment-receipt.component.css',
})
export class PaymentReceiptComponent {

  private readonly service = inject(PaymentReceiptService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<PaymentReceipt>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $items = this.service.$listChange;
  protected displayedColumns = ['idReceipt', 'order', 'receiptType', 'series', 'receiptNumber', 'emissionDate', 'totalAmount', 'paymentMethod', 'status', 'actions'];

  constructor() {
    this.service.findAll().subscribe(data => this.service.setListChange(data));

    effect(() => {
      const ds = this.$dataSource();
      ds.data = this.$items();
      ds.paginator = this.$paginator();
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
    this.$dataSource().filter = (e.target.value as string).trim().toLowerCase();
  }

  delete(id: number) {
    if (window.confirm('¿Eliminar este comprobante?')) {
      this.service.delete(id).pipe(
        switchMap(() => this.service.findAll()),
        tap(data => this.service.setListChange(data)),
        tap(() => this.service.setMessageChange('DELETED'))
      ).subscribe();
    }
  }
}
