import { FormHeaderComponent } from '../../../shared/form-header/form-header.component';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../services/employee.service';
import { RoleService } from '../../../services/rol.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Employee } from '../../../model/employee';
import { switchMap, tap } from 'rxjs';
import { dniValidator, nameValidator, phoneValidator } from '../../../shared/app-validators';
import { DniInputDirective, NameInputDirective, PhoneInputDirective } from '../../../shared/phone-dni-input.directive';

/** Estados validos para un empleado en el sistema. */
const EMPLOYEE_STATUSES = ['ACTIVO', 'INACTIVO'] as const;

@Component({
  selector: 'app-employee-edit',
  imports: [
    FormHeaderComponent,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    RouterLink,
    PhoneInputDirective,
    DniInputDirective,
    NameInputDirective,
  ],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css',
})
export class EmployeeEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(EmployeeService);
  private readonly roleService = inject(RoleService);

  /** Estados disponibles para el campo Status. */
  protected readonly statuses = EMPLOYEE_STATUSES;

  /** Roles del sistema cargados desde el API, excluyendo 'ADMIN'. */
  protected $roles = toSignal(this.roleService.findAll(), { initialValue: [] });
  protected $jobRoles = computed(() =>
    this.$roles().filter(r => r.name?.toUpperCase() !== 'ADMIN')
  );

  protected $form = signal(new FormGroup({
    idEmployee: new FormControl<number | null>(null),
    name: new FormControl<string>('', [Validators.required, nameValidator]),
    lastName: new FormControl<string>('', [Validators.required, nameValidator]),
    address: new FormControl<string>('', [Validators.required]),
    job: new FormControl<string>('', [Validators.required]),
    phone: new FormControl<string>('', [Validators.required, phoneValidator]),
    status: new FormControl<string>('ACTIVO', [Validators.required]),
    dni: new FormControl<string>('', [Validators.required, dniValidator]),
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
    const item: Employee = this.$form().value as unknown as Employee;
    const op$ = isEdit ? this.service.update(id, item) : this.service.save(item);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    ).subscribe(() => this.router.navigate(['/pages/employee']));
  }
}
