import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Product } from '../../model/product';
import { ProductService } from '../../services/product.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DecimalPipe } from '@angular/common';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-product',
  imports: [
    MatTableModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatButtonModule,
    MatIconModule, RouterLink, RouterOutlet, MatSnackBarModule, DecimalPipe,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css',
})
export class ProductComponent {

  private readonly service = inject(ProductService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Product>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $items = this.service.$listChange;
  protected displayedColumns = ['idProduct', 'name', 'price', 'preparationTime', 'availability', 'category', 'actions'];

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
    if (window.confirm('¿Eliminar este producto?')) {
      this.service.delete(id).pipe(
        switchMap(() => this.service.findAll()),
        tap(data => this.service.setListChange(data)),
        tap(() => this.service.setMessageChange('DELETED'))
      ).subscribe();
    }
  }
}
