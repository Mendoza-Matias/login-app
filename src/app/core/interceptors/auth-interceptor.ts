import { HttpContextToken, HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { secrets } from '../config/secrets';
import { SessionService } from '../services/session.service';

const RETRIED_AFTER_REFRESH = new HttpContextToken(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const session = inject(SessionService);
  const router = inject(Router);
  const token = session.getAccessToken();
  const isApiRequest = req.url.startsWith(secrets.apiUrl);
  const isAuthRequest = req.url.startsWith(`${secrets.apiUrl}/api/auth/`);

  let clonedRequest = req;

  if (token && isApiRequest && !isAuthRequest) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }


 return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (
        error.status !== 401 ||
        !isApiRequest ||
        isAuthRequest ||
        req.context.get(RETRIED_AFTER_REFRESH)
      ) {
        return throwError(() => error);
      }

      return session.refreshAccessToken().pipe(
        catchError((refreshError) => {
          session.clearSession();
          void router.navigate(['/login']);
          return throwError(() => refreshError);
        }),
        switchMap((accessToken) =>
          next(
            req.clone({
              context: req.context.set(RETRIED_AFTER_REFRESH, true),
              setHeaders: { Authorization: `Bearer ${accessToken}` },
            }),
          ),
        ),
      );
    })
  );
};
