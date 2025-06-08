import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http'; // Importar
import { FormsModule } from '@angular/forms'; // Importar

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // Adicionar estas linhas
    importProvidersFrom(FormsModule), 
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};