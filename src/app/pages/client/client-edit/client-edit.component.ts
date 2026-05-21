import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ClientService } from '../../../services/client.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Client } from '../../../model/client';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-client-edit',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './client-edit.component.html',
  styleUrl: './client-edit.component.css',
})
export class ClientEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly clientService = inject(ClientService);

  protected $form = signal(new FormGroup({
    idClient: new FormControl<number | null>(null),
    dni: new FormControl<number | null>(null),
    name: new FormControl<string>(''),
    lastName: new FormControl<string>(''),
    phone: new FormControl<string>(''),
    email: new FormControl<string>(''),
    birthDate: new FormControl<Date | string | null>(null),
    address: new FormControl<string>(''),
    ruc: new FormControl<string>(''),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    effect(() => {
      const id = this.$id();
      if (id) {
        this.clientService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  operate() {
    const form = this.$form();
    const isEdit = this.$isEdit();
    const id = this.$id();

    const client: Client = form.value as unknown as Client;

    const operation$ = isEdit ? this.clientService.update(id, client) : this.clientService.save(client);

    operation$.pipe(
      switchMap(() => this.clientService.findAll()),
      tap(data => this.clientService.setClientChange(data)),
      tap(() => this.clientService.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    )
      .subscribe(() => {
        this.router.navigate(['/pages/client']);
      });
  }
}
