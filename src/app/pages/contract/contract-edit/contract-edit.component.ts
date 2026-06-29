import { FormHeaderComponent } from '../../../shared/form-header/form-header.component';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContractService } from '../../../services/contract.service';
import { EmployeeService } from '../../../services/employee.service';
import { SupplierService } from '../../../services/supplier.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Contract } from '../../../model/contract';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-contract-edit',
  imports: [FormHeaderComponent, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink, MatSelectModule],
  templateUrl: './contract-edit.component.html',
  styleUrl: './contract-edit.component.css',
})
export class ContractEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly service = inject(ContractService);
  protected readonly employeeService = inject(EmployeeService);
  protected readonly supplierService = inject(SupplierService);

  protected $form = signal(new FormGroup({
    idContract: new FormControl<number | null>(null),
    startDate: new FormControl<string>('', [Validators.required]),
    endDate: new FormControl<string>(''),
    contractType: new FormControl<string>('', [Validators.required]),
    salary: new FormControl<number | null>(null, [Validators.required]),
    clause: new FormControl<string>(''),
    employee: new FormControl<any>(null, [Validators.required]),
    supplier: new FormControl<any>(null),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    this.employeeService.findAll().subscribe(data => this.employeeService.setListChange(data));
    this.supplierService.findAll().subscribe(data => this.supplierService.setListChange(data));
    effect(() => {
      const id = this.$id();
      if (id) this.service.findById(id).subscribe(data => this.$form().patchValue(data));
    });
  }

  compareFnEmployee(a: any, b: any): boolean {
    return a && b ? a.idEmployee === b.idEmployee : a === b;
  }

  compareFnSupplier(a: any, b: any): boolean {
    return a && b ? a.idSupplier === b.idSupplier : a === b;
  }

  operate() {
    if (this.$form().invalid) return;
    const isEdit = this.$isEdit();
    const id = this.$id();
    const item: Contract = this.$form().value as unknown as Contract;
    const op$ = isEdit ? this.service.update(id, item) : this.service.save(item);
    op$.pipe(
      switchMap(() => this.service.findAll()),
      tap(data => this.service.setListChange(data)),
      tap(() => this.service.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    ).subscribe(() => this.router.navigate(['/pages/contract']));
  }
}
