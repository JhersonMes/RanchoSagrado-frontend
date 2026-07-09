import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Role } from '../../model/role';
import { RoleService } from '../../services/rol.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';
import { PageableSearch } from '../../shared/pageable-search';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BackToHomeComponent } from '../../shared/back-to-home/back-to-home.component';

@Component({
  selector: 'app-role',
  imports: [
    BackToHomeComponent,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterLink,
    RouterOutlet,
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css',
})
export class RoleComponent {

  private readonly roleService = inject(RoleService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Role>());
  protected $sort = viewChild(MatSort);
  protected $roles = this.roleService.$listChange;
  protected readonly pageable = new PageableSearch<Role>(
    (page, size) => this.roleService.findAllPageable(page, size),
    () => this.$roles(),
  );

  protected displayedColumns: string[] = ['idRole', 'name', 'description', 'actions'];

  constructor() {
    this.roleService.findAll().subscribe(data => this.roleService.setListChange(data));
    this.pageable.loadServerPage();

    effect(() => {
      const s = this.$sort();
      const ds = this.$dataSource();
      ds.data = this.pageable.data();
      ds.sort = s;
    });

    effect(() => {
      const message = this.roleService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.roleService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    this.pageable.applyFilter(e.target.value as string);
  }

  delete(idRole: number) {
    const ok = window.confirm('¿Seguro que deseas eliminar este rol?');
    if (ok) {
      this.roleService.delete(idRole)
        .pipe(
          switchMap(() => this.roleService.findAll()),
          tap(data => this.roleService.setListChange(data)),
          tap(() => this.roleService.setMessageChange('DELETED')),
          tap(() => this.pageable.loadServerPage())
        )
        .subscribe();
    }
  }
}