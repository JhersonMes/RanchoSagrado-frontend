import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Role } from '../../model/role';
import { RoleService } from '../../services/rol.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { switchMap, tap } from 'rxjs';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-role',
  imports: [
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    RouterOutlet,
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css',
})
export class RoleComponent {

  private readonly roleService = inject(RoleService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Role>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $roles = this.roleService.$listChange;

  protected displayedColumns: string[] = ['idRole', 'name', 'description', 'actions'];

  constructor() {
    this.roleService.findAll().subscribe(data => this.roleService.setListChange(data));

    effect(() => {
      const data = this.$roles();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = p;
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
    this.$dataSource().filter = (e.target.value as string).trim().toLowerCase();
  }

  delete(idRole: number) {
    const ok = window.confirm('¿Seguro que deseas eliminar este rol?');
    if (ok) {
      this.roleService.delete(idRole)
        .pipe(
          switchMap(() => this.roleService.findAll()),
          tap(data => this.roleService.setListChange(data)),
          tap(() => this.roleService.setMessageChange('DELETED'))
        )
        .subscribe();
    }
  }
}