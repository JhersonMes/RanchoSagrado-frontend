import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { User } from '../../model/user';
import { UserService } from '../../services/user.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { switchMap, tap } from 'rxjs';
import { PageableSearch } from '../../shared/pageable-search';
import { BackToHomeComponent } from '../../shared/back-to-home/back-to-home.component';

@Component({
  selector: 'app-user',
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
    MatChipsModule,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {

  private readonly userService = inject(UserService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<User>());
  protected $sort = viewChild(MatSort);
  protected $users = this.userService.$listChange;
  protected readonly pageable = new PageableSearch<User>(
    (page, size) => this.userService.findAllPageable(page, size),
    () => this.$users(),
  );

  protected displayedColumns: string[] = [
    'idUser', 'username', 'email', 'role', 'enabled', 'actions'
  ];

  constructor() {
    this.userService.findAll().subscribe(data => this.userService.setListChange(data));
    this.pageable.loadServerPage();

    effect(() => {
      const s = this.$sort();
      const ds = this.$dataSource();
      ds.data = this.pageable.data();
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
    this.pageable.applyFilter(e.target.value as string);
  }

  delete(idUser: number) {
    const ok = window.confirm('¿Seguro que deseas eliminar este usuario?');
    if (ok) {
      this.userService.delete(idUser)
        .pipe(
          switchMap(() => this.userService.findAll()),
          tap(data => this.userService.setListChange(data)),
          tap(() => this.userService.setMessageChange('DELETED')),
          tap(() => this.pageable.loadServerPage())
        )
        .subscribe();
    }
  }
}