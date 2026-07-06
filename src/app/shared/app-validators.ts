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

  /** Telefono peruano: exactamente 9 digitos, debe iniciar con 9. */
  static phone(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;
    return /^9[0-9]{8}$/.test(value) ? null : { phone: true };
  }

  /** Solo letras (incluyendo acentos y ñ) y espacios. No permite numeros ni simbolos. */
  static name(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return /^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$/.test(String(value).trim()) ? null : { nameOnly: true };
  }

  /** DNI peruano: exactamente 8 digitos, el primero entre 1 y 9 (no empieza en 0). */
  static dni(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return /^[1-9][0-9]{7}$/.test(String(value)) ? null : { dni: true };
  }

  /** RUC peruano: 11 digitos, con prefijo valido de SUNAT (10, 15, 17 o 20). */
  static ruc(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') return null;
    return /^(10|15|17|20)[0-9]{9}$/.test(String(value)) ? null : { ruc: true };
  }

  /** Bloquea la escritura en telefono: solo numeros, max 9 digitos, primer digito debe ser 9. */
  static phoneKeypress(event: KeyboardEvent, currentValue: string | null): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    // Permitir teclas de control: Backspace, Delete, flechas, Tab, Home, End
    const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab'];
    if (controlKeys.includes(event.key)) return;
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      return;
    }
    const current = (currentValue ?? '').toString();
    if (current.length === 0 && event.key !== '9') {
      event.preventDefault();
      return;
    }
    if (current.length >= 9) {
      event.preventDefault();
    }
  }

  /** Bloquea caracteres no validos en campos de nombre (solo letras y espacios). */
  static nameKeypress(event: KeyboardEvent): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    // Permitir teclas de control: Backspace, Delete, flechas, Tab, Home, End
    const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab'];
    if (controlKeys.includes(event.key)) return;
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]$/.test(event.key)) {
      event.preventDefault();
    }
  }

  /** Bloquea la escritura de mas de 8 digitos, caracteres no numericos, o 0 como primer digito (DNI peruano). */
  static dniKeypress(event: KeyboardEvent, currentValue: string | number | null): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    // Permitir teclas de control: Backspace, Delete, flechas, Tab, Home, End
    const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab'];
    if (controlKeys.includes(event.key)) return;
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      return;
    }
    const current = (currentValue ?? '').toString();
    if (current.length === 0 && event.key === '0') {
      event.preventDefault();
      return;
    }
    if (current.length >= 8) {
      event.preventDefault();
    }
  }

  /** Bloquea la escritura de mas de 11 digitos o caracteres no numericos en RUC. */
  static rucKeypress(event: KeyboardEvent, currentValue: string | number | null): void {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const controlKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End', 'Tab'];
    if (controlKeys.includes(event.key)) return;
    if (!/^[0-9]$/.test(event.key)) {
      event.preventDefault();
      return;
    }
    const current = (currentValue ?? '').toString();
    if (current.length >= 11) {
      event.preventDefault();
    }
  }
  /**
   * Valida que el año en un campo datetime-local tenga exactamente 4 digitos.
   * Formato esperado del input: "YYYY-MM-DDThh:mm"
   */
  static dateYear4Digits(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) return null;
    const year = value.split('-')[0];
    return year.length === 4 ? null : { yearInvalid: true };
  }

  /**
   * Valida que la fecha/hora seleccionada no sea anterior al momento actual.
   * Aplica a inputs de tipo datetime-local (valor en formato "YYYY-MM-DDThh:mm").
   */
  static notPastDate(control: AbstractControl): ValidationErrors | null {
    const value = control.value as string;
    if (!value) return null;
    const selected = new Date(value);
    const now = new Date();
    return selected > now ? null : { pastDate: true };
  }
}

export const positivePriceValidator: ValidatorFn = AppValidators.positivePrice;
export const phoneValidator: ValidatorFn = AppValidators.phone;
export const dniValidator: ValidatorFn = AppValidators.dni;
export const rucValidator: ValidatorFn = AppValidators.ruc;
export const nameValidator: ValidatorFn = AppValidators.name;
export const dateYear4DigitsValidator: ValidatorFn = AppValidators.dateYear4Digits;
export const notPastDateValidator: ValidatorFn = AppValidators.notPastDate;
