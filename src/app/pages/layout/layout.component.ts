import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { LoginService } from '../../services/login.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatMenuModule, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  private readonly router = inject(Router);
  private readonly loginService = inject(LoginService);

  protected readonly pageTitle = signal('Rancho Sagrado');
  protected readonly userName = signal('Usuario');
  protected readonly userRole = signal('');
  protected readonly userInitial = computed(() => this.userName().charAt(0).toUpperCase());

  constructor() {
    this.pageTitle.set(this.resolveTitle());

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.pageTitle.set(this.resolveTitle()));

    this.loginService.showUserInfo().subscribe({
      next: (data: any) => {
        const employee = data?.employee;
        this.userName.set(employee ? `${employee.name} ${employee.lastName}` : data?.username ?? 'Usuario');
        this.userRole.set(data?.role?.name ?? employee?.job ?? '');
      },
      error: () => {},
    });
  }

  private resolveTitle(): string {
    let route = this.router.routerState.snapshot.root;
    let title = route.data['title'] as string | undefined;
    while (route.firstChild) {
      route = route.firstChild;
      if (route.data['title']) title = route.data['title'];
    }
    return title ?? 'Rancho Sagrado';
  }

  logout(): void {
    this.loginService.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout(): void {
    sessionStorage.removeItem(environment.TOKEN_NAME);
    this.router.navigate(['/login']);
  }
}
