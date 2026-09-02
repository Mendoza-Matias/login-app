import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { Store } from '../services/store';

export const guestGuard: CanActivateFn = (route, state) => {

  const store = inject(Store);
  const router = inject(Router);

  const isAuthenticated = !!store.get<string>('access_token');

  return isAuthenticated ? router.navigate(['/dashboard']) : true;
}
