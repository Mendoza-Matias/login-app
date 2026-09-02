import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { guestGuard } from './core/guards/guest-guard';

export const routes: Routes = [
  // Redirige la raíz automáticamente al login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta para el Login
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then((module) => module.Login),
    canActivate: [guestGuard]
  },

  // Ruta para el Dashboard - Protegida utilizando un guard
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then((module) => module.Dashboard),
    canActivate: [authGuard],
  },

  // Comodín para redirigir cualquier ruta inexistente al login
  { path: '**', redirectTo: 'login' }
];
