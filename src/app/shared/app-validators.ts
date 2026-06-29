import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validadores reutilizables compartidos por todos los formularios del sistema,
 * para no duplicar reglas de negocio (precio, telefono, DNI) en cada *-edit.
 */
export class AppValidators {

  /** El valor debe ser un numero mayor a 0 (precios, totales, subtotales). */
  static positivePrice(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return Number(value) > 0 ? null : { positivePrice: true };
  }

  /** Solo numeros y los caracteres + y - (telefonos locales/internacionales). */
  static phone(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    return /^[0-9+\-]+$/.test(value) ? null : { phone: true };
  }

  /** DNI: solo numeros, maximo 8 digitos. */
  static dni(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return /^[0-9]{1,8}$/.test(String(value)) ? null : { dni: true };
  }

  /** Bloquea la escritura de caracteres no numericos/+/- en el input de telefono. */
  static phoneKeypress(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (!/^[0-9+\-]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  /** Bloquea la escritura de mas de 8 digitos o caracteres no numericos en DNI. */
  static dniKeypress(event: KeyboardEvent, currentValue: string | number | null): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      return;
    }
    if ((currentValue ?? '').toString().length >= 8) {
      event.preventDefault();
    }
  }
}

export const positivePriceValidator: ValidatorFn = AppValidators.positivePrice;
export const phoneValidator: ValidatorFn = AppValidators.phone;
export const dniValidator: ValidatorFn = AppValidators.dni;
