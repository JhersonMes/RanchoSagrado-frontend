import { Component, signal } from '@angular/core';
import { LayoutComponent } from './pages/layout/layout.component';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('RanchoSagrado_Frontend');
}
