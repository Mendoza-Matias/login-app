import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { SessionService } from '../../../core/services/session.service';
import { ErrorMessageService } from '../../../core/services/error-message.service';

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

  private session = inject(SessionService);
  private router = inject(Router);
  private errorMessages = inject(ErrorMessageService);


  //manejador de estado
  username = signal('');
  password = signal('');
  isLoading = signal(false);
  errorMessage = signal('');

  onLogin(event: Event) {
    event.preventDefault();

    if (!this.username() || !this.password()) {
      this.errorMessage.set('Por favor, completa todos los campos.')
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.session.login({ username: this.username(), password: this.password() }).subscribe({
      next: () => {
        this.isLoading.set(false);
        void this.router.navigate(['/dashboard']);
      },
      error: (error: unknown) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          this.errorMessages.getMessage(error, 'No se pudo iniciar sesión. Inténtalo de nuevo.'),
        );
      },
    });
  }
}
