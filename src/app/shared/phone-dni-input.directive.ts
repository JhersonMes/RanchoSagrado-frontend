import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { AppValidators } from './app-validators';

/** Restringe el input a numeros, + y - (telefonos). */
@Directive({
  selector: '[appPhoneInput]',
  standalone: true,
})
export class PhoneInputDirective {
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    AppValidators.phoneKeypress(event);
  }
}

/** Restringe el input a maximo 8 digitos numericos (DNI). */
@Directive({
  selector: '[appDniInput]',
  standalone: true,
})
export class DniInputDirective {
  constructor(private readonly ngControl: NgControl) {}

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    AppValidators.dniKeypress(event, this.ngControl.control?.value ?? '');
  }
}
