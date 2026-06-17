import { Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
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
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

  private readonly loginService = inject(LoginService);
  private readonly router = inject(Router);

  loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
    ]),
  });

  isFormValid = toSignal(
    this.loginForm.statusChanges.pipe(map((status) => status === 'VALID')),
    { initialValue: this.loginForm.valid }
  );

  isLoggingIn = signal(false);

  loginError = signal<string | null>(null);

  showPassword = false;

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoggingIn.set(true);
    this.loginError.set(null);

    const { username, password } = this.loginForm.value;

    this.loginService.login(username, password).subscribe({
      next: (data) => {
        const token = data.access_token || data.accessToken;
        if (token) {
          sessionStorage.setItem(environment.TOKEN_NAME, token);
          this.router.navigate(['/pages/client']);
        } else {
          this.isLoggingIn.set(false);
          this.loginError.set('Error en la respuesta del servidor. No se recibió el token.');
          console.error('No token found in login response:', data);
        }
      },
      error: (err) => {
        this.isLoggingIn.set(false);
        if (err.status === 401) {
          this.loginError.set('Credenciales incorrectas. Intenta de nuevo.');
        } else {
          this.loginError.set('Ocurrió un error. Por favor intenta más tarde.');
        }
      },
      complete: () => {
        this.isLoggingIn.set(false);
      },
    });
  }
}