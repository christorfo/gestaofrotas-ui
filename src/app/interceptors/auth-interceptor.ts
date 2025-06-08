import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Injeta o AuthService para pegar o token
  const authService = inject(AuthService);
  const authToken = authService.getToken();

  // Se um token existir, clona a requisição e adiciona o cabeçalho de autorização
  if (authToken) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`
      }
    });
    return next(authReq);
  }

  // Se não houver token, apenas passa a requisição original adiante
  return next(req);
};