import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { isApiError } from '../models/api-error.model';

@Injectable({ providedIn: 'root' })
export class ErrorMessageService {
  getMessage(error: unknown, fallback: string): string {
    if (!(error instanceof HttpErrorResponse)) {
      return fallback;
    }

    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Inténtalo de nuevo.';
    }

    if (!isApiError(error.error)) {
      return fallback;
    }

    const validationMessages = Object.values(error.error.fieldErrors ?? {});
    return validationMessages.length > 0
      ? validationMessages.join(' ')
      : error.error.message;
  }
}

