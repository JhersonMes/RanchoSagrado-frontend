import { Routes } from '@angular/router';
import { noCajeroGuard } from '../guards/no-cajero.guard';

export const pagesRoutes: Routes = [
  // Advertencia previa a Administrar Negocio
  {
    path: 'business-warning',
    loadComponent: () =>
      import('./business-warning/business-warning.component').then(
        (m) => m.BusinessWarningComponent,
      ),
    data: { title: 'Administrar Negocio' },
    canActivate: [noCajeroGuard],
  },

  // Administrar Negocio (dashboard)
  {
    path: 'business',
    loadComponent: () => import('./business/business.component').then((m) => m.BusinessComponent),
    data: { title: 'Administrar Negocio' },
    canActivate: [noCajeroGuard],
  },

  // Clientes
  {
    path: 'client',
    loadComponent: () => import('./client/client.component').then((m) => m.ClientComponent),
    data: { title: 'Clientes' },
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
    loadComponent: () => import('./supplier/supplier.component').then((m) => m.SupplierComponent),
    data: { title: 'Proveedores' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./supplier/supplier-edit/supplier-edit.component').then(
            (m) => m.SupplierEditComponent,
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./supplier/supplier-edit/supplier-edit.component').then(
            (m) => m.SupplierEditComponent,
          ),
      },
    ],
  },

  // Roles
  {
    path: 'role',
    loadComponent: () => import('./role/role.component').then((m) => m.RoleComponent),
    data: { title: 'Roles' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./role/role-edit/role-edit.component').then((m) => m.RoleEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./role/role-edit/role-edit.component').then((m) => m.RoleEditComponent),
      },
    ],
  },

  // Usuarios
  {
    path: 'user',
    loadComponent: () => import('./user/user.component').then((m) => m.UserComponent),
    data: { title: 'Usuarios' },
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

  // Empleados
  {
    path: 'employee',
    loadComponent: () => import('./employee/employee.component').then((m) => m.EmployeeComponent),
    data: { title: 'Empleados' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./employee/employee-edit/employee-edit.component').then(
            (m) => m.EmployeeEditComponent,
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./employee/employee-edit/employee-edit.component').then(
            (m) => m.EmployeeEditComponent,
          ),
      },
    ],
  },

  // Turnos
  {
    path: 'shift',
    loadComponent: () => import('./shift/shift.component').then((m) => m.ShiftComponent),
    data: { title: 'Turnos' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./shift/shift-edit/shift-edit.component').then((m) => m.ShiftEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./shift/shift-edit/shift-edit.component').then((m) => m.ShiftEditComponent),
      },
    ],
  },

  // Categorías de Ingredientes
  {
    path: 'ingredient-category',
    loadComponent: () =>
      import('./ingredient-category/ingredient-category.component').then(
        (m) => m.IngredientCategoryComponent,
      ),
    data: { title: 'Categorías de Ingrediente' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./ingredient-category/ingredient-category-edit/ingredient-category-edit.component').then(
            (m) => m.IngredientCategoryEditComponent,
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./ingredient-category/ingredient-category-edit/ingredient-category-edit.component').then(
            (m) => m.IngredientCategoryEditComponent,
          ),
      },
    ],
  },

  // Ingredientes
  {
    path: 'ingredient',
    loadComponent: () =>
      import('./ingredient/ingredient.component').then((m) => m.IngredientComponent),
    data: { title: 'Ingredientes' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./ingredient/ingredient-edit/ingredient-edit.component').then(
            (m) => m.IngredientEditComponent,
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./ingredient/ingredient-edit/ingredient-edit.component').then(
            (m) => m.IngredientEditComponent,
          ),
      },
    ],
  },

  // Inventario
  {
    path: 'inventory',
    loadComponent: () =>
      import('./inventory/inventory.component').then((m) => m.InventoryComponent),
    data: { title: 'Inventario' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./inventory/inventory-edit/inventory-edit.component').then(
            (m) => m.InventoryEditComponent,
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./inventory/inventory-edit/inventory-edit.component').then(
            (m) => m.InventoryEditComponent,
          ),
      },
    ],
  },

  // Menús
  {
    path: 'menu',
    loadComponent: () => import('./menu/menu.component').then((m) => m.MenuComponent),
    data: { title: 'Cartas' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./menu/menu-edit/menu-edit.component').then((m) => m.MenuEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./menu/menu-edit/menu-edit.component').then((m) => m.MenuEditComponent),
      },
    ],
  },

  // Categorías de Productos
  {
    path: 'product-category',
    loadComponent: () =>
      import('./product-category/product-category.component').then(
        (m) => m.ProductCategoryComponent,
      ),
    data: { title: 'Categorías de Producto' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./product-category/product-category-edit/product-category-edit.component').then(
            (m) => m.ProductCategoryEditComponent,
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./product-category/product-category-edit/product-category-edit.component').then(
            (m) => m.ProductCategoryEditComponent,
          ),
      },
    ],
  },

  // Productos
  {
    path: 'product',
    loadComponent: () => import('./product/product.component').then((m) => m.ProductComponent),
    data: { title: 'Productos' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./product/product-edit/product-edit.component').then(
            (m) => m.ProductEditComponent,
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./product/product-edit/product-edit.component').then(
            (m) => m.ProductEditComponent,
          ),
      },
    ],
  },

  // Promociones
  {
    path: 'promotion',
    loadComponent: () =>
      import('./promotion/promotion.component').then((m) => m.PromotionComponent),
    data: { title: 'Promociones' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./promotion/promotion-edit/promotion-edit.component').then(
            (m) => m.PromotionEditComponent,
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./promotion/promotion-edit/promotion-edit.component').then(
            (m) => m.PromotionEditComponent,
          ),
      },
    ],
  },

  // Mesas
  {
    path: 'restaurant-table',
    loadComponent: () =>
      import('./restaurant-table/restaurant-table.component').then(
        (m) => m.RestaurantTableComponent,
      ),
    data: { title: 'Mesas' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./restaurant-table/restaurant-table-edit/restaurant-table-edit.component').then(
            (m) => m.RestaurantTableEditComponent,
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./restaurant-table/restaurant-table-edit/restaurant-table-edit.component').then(
            (m) => m.RestaurantTableEditComponent,
          ),
      },
    ],
  },

  // Reservas
  {
    path: 'reservation',
    loadComponent: () =>
      import('./reservation/reservation.component').then((m) => m.ReservationComponent),
    data: { title: 'Reservaciones' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./reservation/reservation-edit/reservation-edit.component').then(
            (m) => m.ReservationEditComponent,
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./reservation/reservation-edit/reservation-edit.component').then(
            (m) => m.ReservationEditComponent,
          ),
      },
    ],
  },

  // Contratos
  {
    path: 'contract',
    loadComponent: () => import('./contract/contract.component').then((m) => m.ContractComponent),
    data: { title: 'Contratos' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./contract/contract-edit/contract-edit.component').then(
            (m) => m.ContractEditComponent,
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./contract/contract-edit/contract-edit.component').then(
            (m) => m.ContractEditComponent,
          ),
      },
    ],
  },

  // Pedidos
  {
    path: 'order',
    loadComponent: () => import('./order/order.component').then((m) => m.OrderComponent),
    data: { title: 'Pedidos' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./order/order-edit/order-edit.component').then((m) => m.OrderEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./order/order-edit/order-edit.component').then((m) => m.OrderEditComponent),
      },
    ],
  },

  // Pagos
  {
    path: 'payment',
    loadComponent: () => import('./payment/payment.component').then((m) => m.PaymentComponent),
    data: { title: 'Pagos' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./payment/payment-edit/payment-edit.component').then(
            (m) => m.PaymentEditComponent,
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./payment/payment-edit/payment-edit.component').then(
            (m) => m.PaymentEditComponent,
          ),
      },
    ],
  },

  // Comprobantes de Pago
  {
    path: 'payment-receipt',
    loadComponent: () =>
      import('./payment-receipt/payment-receipt.component').then((m) => m.PaymentReceiptComponent),
    data: { title: 'Comprobantes de Pago' },
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./payment-receipt/payment-receipt-edit/payment-receipt-edit.component').then(
            (m) => m.PaymentReceiptEditComponent,
          ),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./payment-receipt/payment-receipt-edit/payment-receipt-edit.component').then(
            (m) => m.PaymentReceiptEditComponent,
          ),
      },
    ],
  },

  // Ruta por defecto
  { path: '', redirectTo: 'business', pathMatch: 'full' },
];
