import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { SessionService } from '../../core/services/session.service';

@Component({
  imports: [MatButtonModule],
  standalone: true,
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard {

  //sirve para el ruteo a otro componente
  private router = inject(Router);
  private session = inject(SessionService);

  user = this.session.currentUser;

  isAdmin = computed(() => this.user()?.roles.includes('ROLE_ADMIN'));
  isEmployee = computed(() => this.user()?.roles.includes('ROLE_EMPLOYEE'));


  logout() {

    this.session.logout().subscribe({
      next: () => void this.router.navigate(['/login']),
      error: () => void this.router.navigate(['/login']),
    });
  }

}
