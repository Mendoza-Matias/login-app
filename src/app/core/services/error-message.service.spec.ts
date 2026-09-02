import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ErrorMessageService } from './error-message.service';

describe('ErrorMessageService', () => {
  let service: ErrorMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ErrorMessageService);
  });

  it('returns the backend error message', () => {
    const error = new HttpErrorResponse({
      status: 401,
      error: {
        timestamp: '2026-09-01T00:00:00Z',
        status: 401,
        error: 'Unauthorized',
        code: 'INVALID_CREDENTIALS',
        message: 'Las credenciales proporcionadas no son válidas.',
        path: '/api/auth/login',
        fieldErrors: {},
      },
    });

    expect(service.getMessage(error, 'Error')).toBe(
      'Las credenciales proporcionadas no son válidas.',
    );
  });

  it('returns a connection message for network errors', () => {
    const error = new HttpErrorResponse({ status: 0 });
    expect(service.getMessage(error, 'Error')).toContain('conectar con el servidor');
  });
});

