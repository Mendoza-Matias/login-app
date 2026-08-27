import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

@Service()
export class Auth {

    private http = inject(HttpClient);

    private url = 'https://api.ejemplo.com/auth'

    login(email: string, password: string): Observable<any> {

        // return this.http.post(`${this.apiUrl}/login`, { email, password });

        const mockUser = { id: 1, name: 'Usuario Angular', email: email };

        return of(mockUser).pipe(delay(1500));
    }
}
