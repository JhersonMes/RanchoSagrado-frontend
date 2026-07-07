import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LayoutComponent } from './pages/layout/layout.component';
import { RegisterComponent } from './login/register/register.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'admin/dashboard',
    loadComponent: () =>
      import('./admin-dashboard/admin-dashboard.component').then((m) => m.AdminDashboardComponent),
  },
  {
    path: 'cajero/dashboard',
    loadComponent: () =>
      import('./cajero-dashboard/cajero-dashboard.component').then(
        (m) => m.CajeroDashboardComponent,
      ),
  },
  {
    path: 'cajero/reporte',
    loadComponent: () =>
      import('./cajero-reporte/cajero-reporte.component').then(
        (m) => m.CajeroReporteComponent,
      ),
  },
  {
    path: 'cliente/dashboard',
    loadComponent: () =>
      import('./cliente-dashboard/cliente-dashboard.component').then(
        (m) => m.ClienteDashboardComponent,
      ),
  },
  {
    path: 'chef/dashboard',
    loadComponent: () =>
      import('./chef-dashboard/chef-dashboard.component').then(
        (m) => m.ChefDashboardComponent,
      ),
  },
  {
    path: 'pages',
    component: LayoutComponent,
    loadChildren: () => import('./pages/pages.routes').then((m) => m.pagesRoutes),
  },
];
