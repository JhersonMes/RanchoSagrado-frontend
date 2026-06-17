import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { EmployeeService } from '../../services/employee.service';
import { RoleService } from '../../services/rol.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    RouterLink,
    MatSnackBarModule,
    MatSelectModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  protected readonly employeeService = inject(EmployeeService);
  protected readonly roleService = inject(RoleService);

  registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
    employee: new FormControl<any>(null, [Validators.required]),
    role: new FormControl<any>(null, [Validators.required]),
  });

  constructor() {
    this.employeeService.findAll().subscribe(data => this.employeeService.setListChange(data));
    this.roleService.findAll().subscribe(data => this.roleService.setListChange(data));
  }

  compareFnEmployee(a: any, b: any): boolean { return a && b ? a.idEmployee === b.idEmployee : a === b; }
  compareFnRole(a: any, b: any): boolean { return a && b ? a.idRole === b.idRole : a === b; }

  isFormValid = toSignal(
    this.registerForm.statusChanges.pipe(map((status) => status === 'VALID')),
    { initialValue: this.registerForm.valid }
  );

  isRegistering = signal(false);
  registerError = signal<string | null>(null);
  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  register(): void {
    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isRegistering.set(true);
    this.registerError.set(null);

    const { username, email, password, employee, role } = this.registerForm.value;

    this.loginService.register(username, email, password, employee, role).subscribe({
      next: () => {
        this.snackBar.open('Usuario registrado exitosamente', 'Cerrar', { duration: 3000 });
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isRegistering.set(false);
        this.registerError.set('Ocurrió un error al registrar. Por favor intenta más tarde.');
        console.error(err);
      },
      complete: () => {
        this.isRegistering.set(false);
      },
    });
  }
}
