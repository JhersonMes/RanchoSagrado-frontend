import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

// Enlace de "volver" que cada página de /pages usa en su cabecera.
// El Administrador regresa al hub de Gestión de Negocio; el resto de roles
// regresa a su propio dashboard (Mesero, Chef, Cajero, Cliente).
@Component({
  selector: 'app-back-to-home',
  standalone: true,
  imports: [RouterLink, MatIconModule],
  template: `
    <a class="page-back" [routerLink]="link()">
      <mat-icon>arrow_back</mat-icon>
      {{ label() }}
    </a>
  `,
})
export class BackToHomeComponent {
  private readonly authService = inject(AuthService);

  private readonly isAdmin = computed(() => this.authService.roleName().toLowerCase().includes('admin'));

  protected readonly link = computed(() =>
    this.isAdmin() ? '/pages/business' : this.authService.resolveHomeRoute(this.authService.roleName()),
  );

  protected readonly label = computed(() =>
    this.isAdmin() ? 'Volver a la Gestión de Negocio' : 'Regresar a Página Principal',
  );
}
