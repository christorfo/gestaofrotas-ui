import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

interface JwtResponse {
  token: string;
  type: string;
  email: string;
  nome: string;
  roles: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  // Injeta o PLATFORM_ID para saber se estamos no navegador ou no servidor
  private platformId = inject(PLATFORM_ID);

  constructor(private http: HttpClient, private router: Router) { }

  login(credentials: { email: string, senha: string }): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Só salva no localStorage se estivermos no navegador
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('userRoles', JSON.stringify(response.roles));
          localStorage.setItem('userEmail', response.email);
          localStorage.setItem('userName', response.nome);
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRoles');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
    }
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('authToken');
    }
    return null; // No servidor, não há token
  }

  isLoggedIn(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!this.getToken();
    }
    return false; // No servidor, o usuário nunca está logado
  }

  getRoles(): string[] {
    if (isPlatformBrowser(this.platformId)) {
      const roles = localStorage.getItem('userRoles');
      return roles ? JSON.parse(roles) : [];
    }
    return []; // No servidor, não há papéis
  }

  isAdmin(): boolean {
    return this.getRoles().includes('ROLE_ADMINISTRADOR');
  }

  isMotorista(): boolean {
    return this.getRoles().includes('ROLE_MOTORISTA');
  }

  getUserName(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userName');
    }
    return null;
  }

  getUserEmail(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('userEmail');
    }
    return null;
  }
}