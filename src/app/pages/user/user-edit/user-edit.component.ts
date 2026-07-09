import { FormHeaderComponent } from '../../../shared/form-header/form-header.component';
import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { RoleService } from '../../../services/rol.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../../model/user';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  standalone: true, 
  imports: [FormHeaderComponent, 
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly roleService = inject(RoleService);

  /** Roles disponibles cargados desde el API. */
  protected $roles = toSignal(this.roleService.findAll(), { initialValue: [] });

  protected $form = signal(new FormGroup({
    idUser: new FormControl<number | null>(null),
    username: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>(''),
    enabled: new FormControl<boolean>(true),
    role: new FormControl<any>(null, [Validators.required])
  }));

  private readonly $params = toSignal(this.route.params, { initialValue: {} });
  protected $id = computed(() => this.$params()['id']);
  protected $isEdit = computed(() => !!this.$id());

  constructor() {
    effect(() => {
      const id = this.$id();
      if (id) {
        this.userService.findById(id).subscribe(data => this.$form().patchValue(data));
      }
    });
  }

  /** Compara roles por id para que el mat-select pre-seleccione correctamente al editar. */
  compareRole(r1: any, r2: any): boolean {
    return r1 && r2 ? r1.idRole === r2.idRole : r1 === r2;
  }

  operate() {
    if (this.$form().invalid) return;

    const formValue = this.$form().value;
    const isEdit = this.$isEdit();
    const id = this.$id();

    const user: User = { ...formValue } as User;
    if (isEdit && !user.password) {
      delete user.password;
    }

    const operation$ = isEdit 
      ? this.userService.update(id, user) 
      : this.userService.save(user);

    operation$.pipe(
      switchMap(() => this.userService.findAll()),
      tap(data => this.userService.setListChange(data)),
      tap(() => this.userService.setMessageChange(isEdit ? 'USER UPDATED' : 'USER CREATED'))
    )
    .subscribe(() => {
      this.router.navigate(['/pages/user']);
    });
  }
}