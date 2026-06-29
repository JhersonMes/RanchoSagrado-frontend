import { FormHeaderComponent } from '../../../shared/form-header/form-header.component';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RestaurantTableService } from '../../../services/restauranttable.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { RestaurantTable } from '../../../model/restauranttable';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-restaurant-table-edit',
  imports: [FormHeaderComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './restaurant-table-edit.component.html',
  styleUrl: './restaurant-table-edit.component.css',
})
export class RestaurantTableEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(RestaurantTableService);

  protected $form = signal(new FormGroup({
    idTable: new FormControl<number | null>(null),
    tableNumber: new FormControl<number | null>(null, [Validators.required]),
    capacity: new FormControl<number | null>(null, [Validators.required]),
    location: new FormControl<string>(''),
    status: new FormControl<string>('DISPONIBLE', [Validators.required]),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    effect(() => {
      const id = this.$id();
      if (id) this.service.findById(id).subscribe(data => this.$form().patchValue(data));
    });
  }

  operate() {
    if (this.$form().invalid) return;
    const isEdit = this.$isEdit();
    const id = this.$id();
    const item: RestaurantTable = this.$form().value as unknown as RestaurantTable;
    const op$ = isEdit ? this.service.update(id, item) : this.service.save(item);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    ).subscribe(() => this.router.navigate(['/pages/restaurant-table']));
  }
}
