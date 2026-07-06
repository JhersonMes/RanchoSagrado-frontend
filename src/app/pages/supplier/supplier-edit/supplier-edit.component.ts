import { FormHeaderComponent } from '../../../shared/form-header/form-header.component';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SupplierService } from '../../../services/supplier.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Supplier } from '../../../model/supplier';
import { switchMap, tap } from 'rxjs';
import { phoneValidator, rucValidator } from '../../../shared/app-validators';
import { PhoneInputDirective, RucInputDirective } from '../../../shared/phone-dni-input.directive';

/** Estados validos para un proveedor en el sistema. */
const SUPPLIER_STATUSES = ['ACTIVO', 'INACTIVO'] as const;

@Component({
  selector: 'app-supplier-edit',
  imports: [FormHeaderComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    PhoneInputDirective,
    RucInputDirective
  ],
  templateUrl: './supplier-edit.component.html',
  styleUrl: './supplier-edit.component.css',
})
export class SupplierEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly supplierService = inject(SupplierService);

  /** Estados disponibles para el campo Status. */
  protected readonly statuses = SUPPLIER_STATUSES;

  protected $form = signal(new FormGroup({
    idSupplier: new FormControl<number | null>(null),
    companyName: new FormControl<string>('', [Validators.required]),
    ruc: new FormControl<string>('', [Validators.required, rucValidator]),
    contactEmail: new FormControl<string>('', [Validators.required, Validators.email]),
    phone: new FormControl<string>('', [Validators.required, phoneValidator]),
    address: new FormControl<string>('', [Validators.required]),
    supplyType: new FormControl<string>('', [Validators.required]),
    status: new FormControl<string>('ACTIVO', [Validators.required]),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    effect(() => {
      const id = this.$id();
      if (id) {
        this.supplierService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  operate() {
    if (this.$form().invalid) return;

    const form = this.$form();
    const isEdit = this.$isEdit();
    const id = this.$id();

    const supplier: Supplier = form.value as unknown as Supplier;

    const operation$ = isEdit ? this.supplierService.update(id, supplier) : this.supplierService.save(supplier);

    operation$.pipe(
      switchMap(() => this.supplierService.findAll()),
      tap(data => this.supplierService.setListChange(data)),
      tap(() => this.supplierService.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    )
      .subscribe(() => {
        this.router.navigate(['/pages/supplier']);
      });
  }
}
