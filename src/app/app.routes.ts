import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login'; 
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard'; 
import { MotoristaDashboardComponent } from './pages/motorista-dashboard/motorista-dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  // Rota pública
  { path: 'login', component: LoginComponent },
  
  // Rotas protegidas que estavam causando o erro
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent, // Deve usar o nome da CLASSE, não do arquivo
    canActivate: [authGuard] 
  },
  { 
    path: 'motorista/dashboard', 
    component: MotoristaDashboardComponent, // Deve usar o nome da CLASSE, não do arquivo
    canActivate: [authGuard]
  },
  
  // Rotas de redirecionamento no final
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' } 
];