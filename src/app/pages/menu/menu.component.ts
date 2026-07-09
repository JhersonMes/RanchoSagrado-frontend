import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Menu } from '../../model/menu';
import { MenuService } from '../../services/menu.service';
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
  selector: 'app-menu',
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
    DecimalPipe,
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {

  private readonly menuService = inject(MenuService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Menu>());
  protected $sort = viewChild(MatSort);
  protected $menus = this.menuService.$listChange;
  protected readonly pageable = new PageableSearch<Menu>(
    (page, size) => this.menuService.findAllPageable(page, size),
    () => this.$menus(),
  );

  protected displayedColumns: string[] = ['idMenu', 'name', 'dishQuantity', 'price', 'description', 'actions'];

  constructor() {
    this.menuService.findAll().subscribe(data => this.menuService.setListChange(data));
    this.pageable.loadServerPage();

    effect(() => {
      const s = this.$sort();
      const ds = this.$dataSource();
      ds.data = this.pageable.data();
      ds.sort = s;
    });

    effect(() => {
      const message = this.menuService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.menuService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    this.pageable.applyFilter(e.target.value as string);
  }

  delete(idMenu: number) {
    const ok = window.confirm('¿Seguro que deseas eliminar este menú?');
    if (ok) {
      this.menuService.delete(idMenu)
        .pipe(
          switchMap(() => this.menuService.findAll()),
          tap(data => this.menuService.setListChange(data)),
          tap(() => this.menuService.setMessageChange('DELETED')),
          tap(() => this.pageable.loadServerPage())
        )
        .subscribe();
    }
  }
}
