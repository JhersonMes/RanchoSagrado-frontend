import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, EMPTY, Observable, retry, tap } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ServerErrorInterceptor implements HttpInterceptor {

  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next
      .handle(req)
      .pipe(retry(environment.RETRY))
      .pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            if (event.body && event.body.error === true && event.body.errorMessage) {
              throw new Error(event.body.errorMessage);
            } /*else {
              this.snackBar.open('SUCCESS', 'INFO', { duration: 2000 });
            }*/
          }
        })
      )
      .pipe(
        catchError((err) => {
          console.error('HTTP Error caught in interceptor:', err);

          // Consultas "best effort" que no deben interrumpir al usuario con un toast
          // si fallan (ej. buscar el Employee vinculado a la cuenta para preseleccionar
          // el campo Empleado; puede no existir o el endpoint puede no estar disponible aún).
          if (req.url.endsWith('/employees/me')) {
            return EMPTY;
          }

          const errorMsg = err.error?.message || err.error?.detail || err.message || 'Error desconocido';

          if (err.status === 400) {
            this.snackBar.open(errorMsg, 'ERROR 400', { duration: 5000 });
          } else if (err.status === 404) {
            this.snackBar.open('No existe el recurso', 'ERROR 404', { duration: 5000 });
          } else if (err.status === 401) {
            this.snackBar.open('No autorizado', 'ERROR 401', { duration: 5000 });
            this.router.navigate(['/login']);
          } else if (err.status === 500) {
            this.snackBar.open(errorMsg, 'ERROR 500', { duration: 5000 });
          } else {
            this.snackBar.open(errorMsg, 'ERROR', { duration: 5000 });
          }

          return EMPTY;
        })
      );
  }
}