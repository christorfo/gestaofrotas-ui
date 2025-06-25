import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  credentials = {
    email: '',
    senha: ''
  };

  onSubmit() {
    this.authService.login(this.credentials).subscribe({
      next: (response) => {
        // Login bem-sucedido
        console.log('Login realizado com sucesso!', response);

        // Redireciona com base no papel (role) do usuário
        if (this.authService.isAdmin()) {
          this.router.navigate(['/admin/dashboard']);
        } else if (this.authService.isMotorista()) {
          this.router.navigate(['/motorista/dashboard']);
        } else {
          // Fallback, caso não tenha um papel conhecido
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.toastr.error('E-mail ou senha inválidos. Tente novamente.', 'Falha na Autenticação');
        console.error('Erro no login:', err);
      }
    });
  }
}