import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

interface BusinessCard {
  title: string;
  subtitle: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-business',
  standalone: true,
  imports: [MatIconModule, RouterLink],
  templateUrl: './business.component.html',
  styleUrl: './business.component.css',
})
export class BusinessComponent {
  protected readonly cards: BusinessCard[] = [
    { title: 'Roles', subtitle: 'Ver y administrar registros', icon: 'shield', link: '/pages/role' },
    { title: 'Usuarios', subtitle: 'Ver y administrar registros', icon: 'group', link: '/pages/user' },
    { title: 'Empleados', subtitle: 'Ver y administrar registros', icon: 'badge', link: '/pages/employee' },
    { title: 'Proveedores', subtitle: 'Ver y administrar registros', icon: 'local_shipping', link: '/pages/supplier' },
    { title: 'Contratos', subtitle: 'Ver y administrar registros', icon: 'description', link: '/pages/contract' },
    { title: 'Turnos', subtitle: 'Ver y administrar registros', icon: 'schedule', link: '/pages/shift' },
    { title: 'Clientes', subtitle: 'Ver y administrar registros', icon: 'person', link: '/pages/client' },
    { title: 'Mesas', subtitle: 'Ver y administrar registros', icon: 'table_restaurant', link: '/pages/restaurant-table' },
    { title: 'Reservaciones', subtitle: 'Ver y administrar registros', icon: 'event', link: '/pages/reservation' },
    { title: 'Cartas', subtitle: 'Ver y administrar registros', icon: 'menu_book', link: '/pages/menu' },
    { title: 'Categorías de Producto', subtitle: 'Ver y administrar registros', icon: 'category', link: '/pages/product-category' },
    { title: 'Productos', subtitle: 'Ver y administrar registros', icon: 'restaurant', link: '/pages/product' },
    { title: 'Categorías de Ingrediente', subtitle: 'Ver y administrar registros', icon: 'kitchen', link: '/pages/ingredient-category' },
    { title: 'Ingredientes', subtitle: 'Ver y administrar registros', icon: 'water_drop', link: '/pages/ingredient' },
    { title: 'Inventario', subtitle: 'Ver y administrar registros', icon: 'inventory_2', link: '/pages/inventory' },
    { title: 'Pedidos', subtitle: 'Ver y administrar registros', icon: 'receipt_long', link: '/pages/order' },
    { title: 'Pagos', subtitle: 'Ver y administrar registros', icon: 'payments', link: '/pages/payment' },
    { title: 'Comprobantes de Pago', subtitle: 'Ver y administrar registros', icon: 'receipt', link: '/pages/payment-receipt' },
    { title: 'Promociones', subtitle: 'Ver y administrar registros', icon: 'sell', link: '/pages/promotion' },
  ];
}
