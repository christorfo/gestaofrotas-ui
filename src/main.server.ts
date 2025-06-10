import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app';
import { config } from './app/app.config.server';

// CORREÇÃO: Usar a classe 'AppComponent' aqui
const bootstrap = () => bootstrapApplication(AppComponent, config);

export default bootstrap;