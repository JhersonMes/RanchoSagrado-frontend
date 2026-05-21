import { Component, effect, inject, signal, untracked, viewChild } from '@angular/core';
import { Client } from '../../model/client';
import { ClientService } from '../../services/client.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { DatePipe } from '@angular/common';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-client',
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
    DatePipe
  ],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent {

  private readonly clientService = inject(ClientService);
  private readonly snackBar = inject(MatSnackBar);

  protected $dataSource = signal(new MatTableDataSource<Client>());
  protected $paginator = viewChild(MatPaginator);
  protected $sort = viewChild(MatSort);

  protected clients = this.clientService.$clientsChange;

  protected displayedColumns: string[] = ['idClient', 'dni', 'name', 'lastName', 'phone', 'email', 'birthDate', 'address', 'ruc', 'actions'];

  constructor() {
    this.clientService.findAll().subscribe(data => this.clientService.setClientChange(data));

    effect(() => {
      const data = this.clients();
      const p = this.$paginator();
      const s = this.$sort();
      const ds = this.$dataSource();

      ds.data = data;
      ds.paginator = p;
      ds.sort = s;
    });

    effect(() => {
      const message = this.clientService.$messageChange();
      if (message) {
        this.snackBar.open(message, 'INFO', { duration: 2000, horizontalPosition: 'right', verticalPosition: 'top' });
        untracked(() => this.clientService.setMessageChange(''));
      }
    });
  }

  applyFilter(e: any) {
    const filterValue = e.target.value;
    this.$dataSource().filter = filterValue.trim().toLowerCase();
  }

  delete(idClient: number) {
    const ok = window.confirm('Are you sure to delete?');
    if (ok) {
      this.clientService.delete(idClient)
        .pipe(
          switchMap(() => this.clientService.findAll()),
          tap(data => this.clientService.setClientChange(data)),
          tap(() => this.clientService.setMessageChange('DELETED'))
        )
        .subscribe();
    }
  }

}
