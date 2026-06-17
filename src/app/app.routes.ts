import { Routes } from '@angular/router';
import { ClientComponent } from './pages/client/client.component';
import { ClientEditComponent } from './pages/client/client-edit/client-edit.component';
import { SupplierComponent } from './pages/supplier/supplier.component';

export const routes: Routes = [
  { path: 'pages/client', component: ClientComponent },
  { path: 'pages/client/new', component: ClientEditComponent },
  { path: 'pages/client/edit/:id', component: ClientEditComponent },
  { path: 'pages/supplier', component: SupplierComponent },
  { path: '', redirectTo: 'pages/client', pathMatch: 'full' }
];
