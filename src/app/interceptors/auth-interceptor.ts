import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injeta o AuthService para pegar o token
  const authService = inject(AuthService);
  const authToken = authService.getToken();
  const apiUrl = environment.apiUrl;

  // Adiciona o token SOMENTE se a requisição for para a nossa API
  if (authToken && req.url.startsWith(apiUrl)) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(authReq);
  }

  // Para todas as outras requisições (como a do ViaCEP), passa adiante sem modificar.
  return next(req);
};