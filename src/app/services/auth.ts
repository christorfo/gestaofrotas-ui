import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

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
  private apiUrl = 'http://localhost:8080/api/auth';
  
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
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userRoles');
      localStorage.removeItem('userEmail');
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
}