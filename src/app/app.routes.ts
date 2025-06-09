import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login'; 
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard'; 
import { MotoristaDashboardComponent } from './pages/motorista-dashboard/motorista-dashboard';
import { authGuard } from './guards/auth-guard';
import { VehicleFormComponent } from './pages/vehicle-form/vehicle-form';

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
    path: 'admin/veiculos/novo', 
    component: VehicleFormComponent,
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