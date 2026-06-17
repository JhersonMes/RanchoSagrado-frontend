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
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./supplier/supplier-edit/supplier-edit.component').then((m) => m.SupplierEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./supplier/supplier-edit/supplier-edit.component').then((m) => m.SupplierEditComponent),
      },
    ],
  },

  // Roles
  {
    path: 'role',
    loadComponent: () =>
      import('./role/role.component').then((m) => m.RoleComponent),
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

  // Empleados
  {
    path: 'employee',
    loadComponent: () =>
      import('./employee/employee.component').then((m) => m.EmployeeComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./employee/employee-edit/employee-edit.component').then((m) => m.EmployeeEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./employee/employee-edit/employee-edit.component').then((m) => m.EmployeeEditComponent),
      },
    ],
  },

  // Turnos
  {
    path: 'shift',
    loadComponent: () =>
      import('./shift/shift.component').then((m) => m.ShiftComponent),
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
      import('./ingredient-category/ingredient-category.component').then((m) => m.IngredientCategoryComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./ingredient-category/ingredient-category-edit/ingredient-category-edit.component').then((m) => m.IngredientCategoryEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./ingredient-category/ingredient-category-edit/ingredient-category-edit.component').then((m) => m.IngredientCategoryEditComponent),
      },
    ],
  },

  // Ingredientes
  {
    path: 'ingredient',
    loadComponent: () =>
      import('./ingredient/ingredient.component').then((m) => m.IngredientComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./ingredient/ingredient-edit/ingredient-edit.component').then((m) => m.IngredientEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./ingredient/ingredient-edit/ingredient-edit.component').then((m) => m.IngredientEditComponent),
      },
    ],
  },

  // Inventario
  {
    path: 'inventory',
    loadComponent: () =>
      import('./inventory/inventory.component').then((m) => m.InventoryComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./inventory/inventory-edit/inventory-edit.component').then((m) => m.InventoryEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./inventory/inventory-edit/inventory-edit.component').then((m) => m.InventoryEditComponent),
      },
    ],
  },

  // Menús
  {
    path: 'menu',
    loadComponent: () =>
      import('./menu/menu.component').then((m) => m.MenuComponent),
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
      import('./product-category/product-category.component').then((m) => m.ProductCategoryComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./product-category/product-category-edit/product-category-edit.component').then((m) => m.ProductCategoryEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./product-category/product-category-edit/product-category-edit.component').then((m) => m.ProductCategoryEditComponent),
      },
    ],
  },

  // Productos
  {
    path: 'product',
    loadComponent: () =>
      import('./product/product.component').then((m) => m.ProductComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./product/product-edit/product-edit.component').then((m) => m.ProductEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./product/product-edit/product-edit.component').then((m) => m.ProductEditComponent),
      },
    ],
  },

  // Promociones
  {
    path: 'promotion',
    loadComponent: () =>
      import('./promotion/promotion.component').then((m) => m.PromotionComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./promotion/promotion-edit/promotion-edit.component').then((m) => m.PromotionEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./promotion/promotion-edit/promotion-edit.component').then((m) => m.PromotionEditComponent),
      },
    ],
  },

  // Mesas
  {
    path: 'restaurant-table',
    loadComponent: () =>
      import('./restaurant-table/restaurant-table.component').then((m) => m.RestaurantTableComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./restaurant-table/restaurant-table-edit/restaurant-table-edit.component').then((m) => m.RestaurantTableEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./restaurant-table/restaurant-table-edit/restaurant-table-edit.component').then((m) => m.RestaurantTableEditComponent),
      },
    ],
  },

  // Reservas
  {
    path: 'reservation',
    loadComponent: () =>
      import('./reservation/reservation.component').then((m) => m.ReservationComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./reservation/reservation-edit/reservation-edit.component').then((m) => m.ReservationEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./reservation/reservation-edit/reservation-edit.component').then((m) => m.ReservationEditComponent),
      },
    ],
  },

  // Contratos
  {
    path: 'contract',
    loadComponent: () =>
      import('./contract/contract.component').then((m) => m.ContractComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./contract/contract-edit/contract-edit.component').then((m) => m.ContractEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./contract/contract-edit/contract-edit.component').then((m) => m.ContractEditComponent),
      },
    ],
  },

  // Pedidos
  {
    path: 'order',
    loadComponent: () =>
      import('./order/order.component').then((m) => m.OrderComponent),
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
    loadComponent: () =>
      import('./payment/payment.component').then((m) => m.PaymentComponent),
    children: [
      {
        path: 'new',
        loadComponent: () =>
          import('./payment/payment-edit/payment-edit.component').then((m) => m.PaymentEditComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import('./payment/payment-edit/payment-edit.component').then((m) => m.PaymentEditComponent),
      },
    ],
  },

  // Ruta por defecto
  { path: '', redirectTo: 'client', pathMatch: 'full' },
];