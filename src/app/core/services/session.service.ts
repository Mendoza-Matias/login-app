import { computed, inject, Injectable, signal } from '@angular/core';
import { catchError, finalize, map, Observable, of, shareReplay, switchMap, tap } from 'rxjs';
import { LoginRequest, UserProfile } from '../models/auth.models';
import { AuthApiService } from './auth-api.service';
import { Store } from './store';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly accessTokenKey = 'access_token';
  private readonly authApi = inject(AuthApiService);
  private readonly store = inject(Store);
  private readonly userState = signal<UserProfile | null>(null);

  private refreshRequest?: Observable<string>;

  readonly currentUser = this.userState.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  login(request: LoginRequest): Observable<UserProfile> {
    this.clearSession();
    return this.authApi.login(request).pipe(
      tap((response) => this.store.set(this.accessTokenKey, response.accessToken)),
      switchMap(() => this.fetchProfile()),
    );
  }

  restoreSession(): Observable<UserProfile | null> {
    const restoreRequest = this.getAccessToken()
      ? this.fetchProfile()
      : this.refreshAccessToken().pipe(switchMap(() => this.fetchProfile()));

    return restoreRequest.pipe(
      catchError(() => {
        this.clearSession();
        return of(null);
      }),
    );
  }

  fetchProfile(): Observable<UserProfile> {
    return this.authApi.getProfile().pipe(tap((profile) => this.userState.set(profile)));
  }

  refreshAccessToken(): Observable<string> {
    if (!this.refreshRequest) {
      this.refreshRequest = this.authApi.refresh().pipe(
        tap((response) => this.store.set(this.accessTokenKey, response.accessToken)),
        map((response) => response.accessToken),
        finalize(() => (this.refreshRequest = undefined)),
        shareReplay({ bufferSize: 1, refCount: true }),
      );
    }

    return this.refreshRequest;
  }

  logout(): Observable<void> {
    return this.authApi.logout().pipe(finalize(() => this.clearSession()));
  }

  getAccessToken(): string | null {
    return this.store.get<string>(this.accessTokenKey);
  }

  clearSession(): void {
    this.store.clear(this.accessTokenKey);
    this.store.clear('token');
    this.userState.set(null);
  }
}
