import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Ingredient } from '../../model/ingredient';
import { IngredientService } from '../../services/ingredient.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DecimalPipe } from '@angular/common';
import { switchMap, tap } from 'rxjs';
import { PageableSearch } from '../../shared/pageable-search';
import { BackToHomeComponent } from '../../shared/back-to-home/back-to-home.component';

@Component({
  selector: 'app-ingredient',
  imports: [
    BackToHomeComponent,
    MatTableModule, MatFormFieldModule, MatInputModule,
    MatPaginatorModule, MatSortModule, MatButtonModule,
    MatIconModule, RouterLink, RouterOutlet, MatSnackBarModule, DecimalPipe,
  ],
  templateUrl: './ingredient.component.html',
  styleUrl: './ingredient.component.css',
})
export class IngredientComponent {

  private readonly service = inject(IngredientService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Ingredient>());
  protected $sort = viewChild(MatSort);
  protected $items = this.service.$listChange;
  protected readonly pageable = new PageableSearch<Ingredient>(
    (page, size) => this.service.findAllPageable(page, size),
    () => this.$items(),
  );
  protected displayedColumns = ['idIngredient', 'name', 'unitOfMeasure', 'unitCost', 'status', 'ingredientCategory', 'actions'];

  constructor() {
    this.service.findAll().subscribe(data => this.service.setListChange(data));
    this.pageable.loadServerPage();

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
    if (window.confirm('¿Eliminar este ingrediente?')) {
      this.service.delete(id).pipe(
        switchMap(() => this.service.findAll()),
        tap(data => this.service.setListChange(data)),
        tap(() => this.service.setMessageChange('DELETED')),
        tap(() => this.pageable.loadServerPage()),
      ).subscribe();
    }
  }
}
