import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Req
  const toastrService = inject(ToastrService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401 || err.error?.message === 'jwt expired') {
        localStorage.clear();
        router.navigate(['auth/login']);
        toastrService.warning('Session expired, please log in again.');
      }
      // show alert
      else {
        toastrService.error(err.error.message, 'Social');
      }
      return throwError(() => err);
    }),
  );
};
