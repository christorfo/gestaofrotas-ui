import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { provideNgxMask } from 'ngx-mask';

import { routes } from './app.routes';
import { authInterceptor } from './interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom(FormsModule),

    provideHttpClient(
      withInterceptors([authInterceptor]),
      withFetch() // Habilita o uso da API fetch para o HttpClient
    ),

    provideNgxMask()
  ]
};