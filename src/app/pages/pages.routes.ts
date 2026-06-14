import { Routes } from '@angular/router';

export const pagesRoutes: Routes = [

  // Clientes
  {
    path: 'client',
    loadComponent: () =>
      import('./client/client.component').then((m) => m.ClientComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./client/client-edit/client-edit.component').then((m) => m.ClientEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./client/client-edit/client-edit.component').then((m) => m.ClientEditComponent),
      },
    ],
  },

  // Proveedores 
  {
    path: 'supplier',
    loadComponent: () =>
      import('./supplier/supplier.component').then((m) => m.SupplierComponent),
  },

  // Roles
  {
    path: 'role',
    loadComponent: () =>
      import('./role/role.component').then((m) => m.RoleComponent),
  },

  // Usuarios
  {
    path: 'user',
    loadComponent: () =>
      import('./user/user.component').then((m) => m.UserComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./user/user-edit/user-edit.component').then((m) => m.UserEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./user/user-edit/user-edit.component').then((m) => m.UserEditComponent),
      },
    ],
  },

  // Ruta por defecto
  { path: '', redirectTo: 'client', pathMatch: 'full' },
];