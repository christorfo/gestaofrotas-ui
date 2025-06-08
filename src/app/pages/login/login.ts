import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // Importar o Router
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  // Injetar dependências de forma moderna
  private authService = inject(AuthService);
  private router = inject(Router);

  credentials = {
    email: '',
    senha: ''
  };

  errorMessage: string | null = null;

  onSubmit() {
    this.errorMessage = null; // Limpa erros antigos
    
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
        // Falha no login
        console.error('Erro no login:', err);
        this.errorMessage = 'E-mail ou senha inválidos. Tente novamente.';
      }
    });
  }
}