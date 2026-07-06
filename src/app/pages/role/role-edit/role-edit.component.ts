import { FormHeaderComponent } from '../../../shared/form-header/form-header.component';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoleService } from '../../../services/rol.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { Role } from '../../../model/role';
import { switchMap, tap } from 'rxjs';
import { nameValidator } from '../../../shared/app-validators';
import { NameInputDirective } from '../../../shared/phone-dni-input.directive';

@Component({
  selector: 'app-role-edit',
  imports: [FormHeaderComponent, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    NameInputDirective
  ],
  templateUrl: './role-edit.component.html',
  styleUrl: './role-edit.component.css',
})
export class RoleEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly roleService = inject(RoleService);

  protected $form = signal(new FormGroup({
    idRole: new FormControl<number | null>(null),
    name: new FormControl<string>('', [Validators.required, nameValidator]),
    description: new FormControl<string>(''),
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    effect(() => {
      const id = this.$id();
      if (id) {
        this.roleService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  operate() {
    if (this.$form().invalid) return;

    const form = this.$form();
    const isEdit = this.$isEdit();
    const id = this.$id();

    const role: Role = form.value as unknown as Role;

    const operation$ = isEdit ? this.roleService.update(id, role) : this.roleService.save(role);

    operation$.pipe(
      switchMap(() => this.roleService.findAll()),
      tap(data => this.roleService.setListChange(data)),
      tap(() => this.roleService.setMessageChange(isEdit ? 'UPDATED' : 'CREATED'))
    )
      .subscribe(() => {
        this.router.navigate(['/pages/role']);
      });
  }
}
