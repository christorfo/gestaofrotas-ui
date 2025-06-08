import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

// Interface para a resposta do login (espelhando nosso DTO de backend)
interface JwtResponse {
  token: string;
  type: string;
  email: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // URL base da nossa API de autenticação
  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  /**
   * Envia as credenciais para a API e armazena o token em caso de sucesso.
   */
  login(credentials: { email: string, senha: string }): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Armazena as informações recebidas no localStorage
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('userRoles', JSON.stringify(response.roles));
        localStorage.setItem('userEmail', response.email);
      })
    );
  }

  /**
   * Remove os dados de autenticação e redireciona para a tela de login.
   */
  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRoles');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }

  /**
   * Retorna o token JWT armazenado.
   */
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  /**
   * Verifica se o usuário está logado (se existe um token).
   */
  isLoggedIn(): boolean {
    return !!this.getToken(); // Retorna true se o token existir, false caso contrário
  }
  
  /**
   * Retorna os papéis (roles) do usuário logado.
   */
  getRoles(): string[] {
    const roles = localStorage.getItem('userRoles');
    return roles ? JSON.parse(roles) : [];
  }

  /**
   * Verifica se o usuário tem o papel de Administrador.
   */
  isAdmin(): boolean {
    return this.getRoles().includes('ROLE_ADMINISTRADOR');
  }

  /**
   * Verifica se o usuário tem o papel de Motorista.
   */
  isMotorista(): boolean {
    return this.getRoles().includes('ROLE_MOTORISTA');
  }
}