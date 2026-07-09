import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Supplier } from '../../model/supplier';
import { SupplierService } from '../../services/supplier.service';
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
import { BackToHomeComponent } from '../../shared/back-to-home/back-to-home.component';

@Component({
  selector: 'app-supplier',
  imports: [
    BackToHomeComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    RouterOutlet,
    MatSnackBarModule,
  ],
  templateUrl: './supplier.component.html',
  styleUrl: './supplier.component.css',
})
export class SupplierComponent {

  private readonly supplierService = inject(SupplierService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Supplier>());
  protected $sort = viewChild(MatSort);
  protected $suppliers = this.supplierService.$listChange;
  protected readonly pageable = new PageableSearch<Supplier>(
    (page, size) => this.supplierService.findAllPageable(page, size),
    () => this.$suppliers(),
  );

  protected displayedColumns: string[] = [
    'idSupplier', 'companyName', 'ruc', 'contactEmail', 'phone', 'supplyType', 'status', 'actions'
  ];

  constructor() {
    this.supplierService.findAll().subscribe(data => this.supplierService.setListChange(data));
    this.pageable.loadServerPage();

    effect(() => {
      const s = this.$sort();
      const ds = this.$dataSource();
      ds.data = this.pageable.data();
      ds.sort = s;
    });

    effect(() => {
      const message = this.supplierService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.supplierService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    this.pageable.applyFilter(e.target.value as string);
  }

  delete(idSupplier: number) {
    const ok = window.confirm('¿Seguro que deseas eliminar este proveedor?');
    if (ok) {
      this.supplierService.delete(idSupplier)
        .pipe(
          switchMap(() => this.supplierService.findAll()),
          tap(data => this.supplierService.setListChange(data)),
          tap(() => this.supplierService.setMessageChange('DELETED')),
          tap(() => this.pageable.loadServerPage())
        )
        .subscribe();
    }
  }
}
