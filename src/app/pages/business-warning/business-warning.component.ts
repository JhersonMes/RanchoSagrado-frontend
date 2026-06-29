import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-business-warning',
  standalone: true,
  templateUrl: './business-warning.component.html',
})
export class BusinessWarningComponent {
  readonly confirmed = signal(false);

  constructor(
    private readonly router: Router,
    private readonly location: Location
  ) {}

  continuar() {
    if (this.confirmed()) {
      this.router.navigate(['/pages/business']);
    }
  }

  cancelar() {
    this.location.back();
  }
}
