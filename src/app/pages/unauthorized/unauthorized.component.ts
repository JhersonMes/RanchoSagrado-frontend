import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './unauthorized.component.html',
})
export class UnauthorizedComponent {
  private readonly authService = inject(AuthService);

  protected readonly homeRoute = computed(() =>
    this.authService.resolveHomeRoute(this.authService.roleName()),
  );
}
