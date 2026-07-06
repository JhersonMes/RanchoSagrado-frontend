import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';
import { AppValidators } from './app-validators';

/** Restringe el input de telefono: solo numeros, max 9 digitos, primer digito = 9. */
@Directive({
  selector: '[appPhoneInput]',
  standalone: true,
})
export class PhoneInputDirective {
  constructor(private readonly ngControl: NgControl) {}

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    AppValidators.phoneKeypress(event, this.ngControl.control?.value ?? '');
  }
}

/** Restringe el input a maximo 8 digitos numericos, primer digito entre 1 y 9 (DNI peruano). */
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

/** Restringe el input a solo letras (incluyendo acentos y ñ) y espacios. */
@Directive({
  selector: '[appNameInput]',
  standalone: true,
})
export class NameInputDirective {
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    AppValidators.nameKeypress(event);
  }
}

/** Restringe el input a maximo 11 digitos numericos (RUC peruano). */
@Directive({
  selector: '[appRucInput]',
  standalone: true,
})
export class RucInputDirective {
  constructor(private readonly ngControl: NgControl) {}

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    AppValidators.rucKeypress(event, this.ngControl.control?.value ?? '');
  }
}
