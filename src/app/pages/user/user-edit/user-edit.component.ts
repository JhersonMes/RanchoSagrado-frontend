import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { User } from '../../../model/user';
import { switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-user-edit',
  standalone: true, 
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    RouterLink
  ],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css',
})
export class UserEditComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  protected $form = signal(new FormGroup({
    idUser: new FormControl<number | null>(null),
    username: new FormControl<string>('', [Validators.required]),
    email: new FormControl<string>('', [Validators.required, Validators.email]),
    password: new FormControl<string>(''),
    enabled: new FormControl<boolean>(true),
    employee: new FormControl<any>(null), 
    role: new FormControl<any>(null)
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