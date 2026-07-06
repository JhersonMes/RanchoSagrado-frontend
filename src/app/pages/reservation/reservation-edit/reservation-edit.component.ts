import { FormHeaderComponent } from '../../../shared/form-header/form-header.component';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ReservationService } from '../../../services/reservation.service';
import { ClientService } from '../../../services/client.service';
import { RestaurantTableService } from '../../../services/restauranttable.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Reservation } from '../../../model/reservation';
import { switchMap, tap } from 'rxjs';
import { dateYear4DigitsValidator, notPastDateValidator } from '../../../shared/app-validators';

@Component({
  selector: 'app-reservation-edit',
  imports: [FormHeaderComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink, MatSelectModule],
  templateUrl: './reservation-edit.component.html',
  styleUrl: './reservation-edit.component.css',
})
export class ReservationEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ReservationService);
  protected readonly clientService = inject(ClientService);
  protected readonly tableService = inject(RestaurantTableService);

  /** Estados validos para una reservacion en el sistema. */
  protected readonly reservationStatuses = ['PENDIENTE', 'CONFIRMADA', 'CANCELADA'] as const;

  /** Fecha/hora minima permitida (ahora mismo) en formato datetime-local para el atributo min del input. */
  protected get minDateTime(): string {
    const now = new Date();
    // Ajuste de zona local → formato 'YYYY-MM-DDThh:mm'
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  }

  protected $form = signal(new FormGroup({
    idReservation: new FormControl<number | null>(null),
    reservationDate: new FormControl<string>('', [Validators.required, dateYear4DigitsValidator, notPastDateValidator]),
    numberOfPeople: new FormControl<number | null>(null, [Validators.required, Validators.min(1), Validators.max(10)]),
    specialOccasion: new FormControl<string>(''),
    status: new FormControl<string>('PENDIENTE', [Validators.required]),
    notes: new FormControl<string>(''),
    client: new FormControl<any>(null, [Validators.required]),
    restaurantTable: new FormControl<any>(null, [Validators.required]),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    this.clientService.findAll().subscribe(data => this.clientService.setListChange(data));
    this.tableService.findAll().subscribe(data => this.tableService.setListChange(data));
    effect(() => {
      const id = this.$id();
      if (id) this.service.findById(id).subscribe(data => this.$form().patchValue(data));
    });
  }

  compareFnClient(a: any, b: any): boolean {
    return a && b ? a.idClient === b.idClient : a === b;
  }

  compareFnTable(a: any, b: any): boolean {
    return a && b ? a.idTable === b.idTable : a === b;
  }

  operate() {
    if (this.$form().invalid) return;
    const isEdit = this.$isEdit();
    const id = this.$id();
    const item: Reservation = this.$form().value as unknown as Reservation;
    if (!isEdit) {
      delete (item as any).idReservation;
    }
    const op$ = isEdit ? this.service.update(id, item) : this.service.save(item);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    ).subscribe(() => this.router.navigate(['/pages/reservation']));
  }
}
