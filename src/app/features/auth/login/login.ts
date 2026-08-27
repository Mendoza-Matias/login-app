import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Auth } from '../../../core/services/auth';
import { email } from '@angular/forms/signals';
import { Store } from '../../../core/services/store';

@Component({
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {

  private authService = inject(Auth);
  private storeService = inject(Store);

  //manejador de estado
  username = signal('');
  password = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  onLogin(event: Event) {
    event.preventDefault();

    if (!this.username() || !this.password) {
      this.errorMessage.set('Por favor, completa todos los campos.')
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    // setTimeout(() => {
    //   this.isLoading.set(false)

    //   if (this.username() === 'employee@gmail.com' && this.password() === '12345') {
    //     alert('¡Inicio de sesión exitoso!')

    //   } else {
    //     this.errorMessage.set('Credenciales incorrectas.');
    //   }
    // }, 1500)
    this.authService.login(this.username(), this.password()).subscribe({
      next: (response) => {
        this.isLoading.set(false)
        alert(`¡Bienvenido de nuevo, ${response.name}!`);
        this.storeService.set("accessToken", response.name) //seteo el token
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(`Error al conectar con el servidor. Inténtalo de nuevo. ${err.message}`);
      }
    })
  }
}
