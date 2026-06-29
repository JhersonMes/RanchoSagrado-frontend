import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { SidebarComponent } from '../../shared/sidebar/sidebar.component';
import { HeaderComponent } from '../../shared/header/header.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  private readonly router = inject(Router);

  protected readonly pageTitle = signal('Rancho Sagrado');

  constructor() {
    this.pageTitle.set(this.resolveTitle());

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.pageTitle.set(this.resolveTitle()));
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
}
