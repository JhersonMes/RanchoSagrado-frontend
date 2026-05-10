import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ClientComponent } from './pages/client/client.component';
import { SupplierComponent } from './pages/supplier/supplier.component';
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ClientComponent, SupplierComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('RanchoSagrado_Frontend');
}
