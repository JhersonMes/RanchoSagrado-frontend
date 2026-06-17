import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { User } from '../../model/user';
import { UserService } from '../../services/user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-user',
  imports: [
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
    MatChipsModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {

  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<User>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);
  protected $users = this.userService.$listChange;

  protected displayedColumns: string[] = [
    'idUser', 'username', 'email', 'employee', 'role', 'enabled', 'actions'
  ];

  constructor() {
    this.userService.findAll().subscribe(data => this.userService.setListChange(data));

    effect(() => {
      const data = this.$users();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();
      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    effect(() => {
      const message = this.userService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.userService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    this.$dataSource().filter = (e.target.value as string).trim().toLowerCase();
  }

  delete(idUser: number) {
    const ok = window.confirm('¿Seguro que deseas eliminar este usuario?');
    if (ok) {
      this.userService.delete(idUser)
        .pipe(
          switchMap(() => this.userService.findAll()),
          tap(data => this.userService.setListChange(data)),
          tap(() => this.userService.setMessageChange('DELETED'))
        )
        .subscribe();
    }
  }
}