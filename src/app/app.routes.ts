import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard';
import { MotoristaDashboardComponent } from './pages/motorista-dashboard/motorista-dashboard';
import { authGuard } from './guards/auth-guard';
import { VehicleFormComponent } from './pages/vehicle-form/vehicle-form';
import { MotoristaFormComponent } from './pages/motorista-form/motorista-form';
import { AgendamentoDetailsComponent } from './pages/agendamento-details/agendamento-details';
import { AgendamentoFormComponent } from './pages/agendamento-form/agendamento-form';
import { ManutencaoFormComponent } from './pages/manutencao-form/manutencao-form';
import { VeiculoManutencoesComponent } from './pages/veiculo-manutencoes/veiculo-manutencoes';
import { OcorrenciaFormComponent } from './pages/ocorrencia-form/ocorrencia-form';
import { VeiculoDetailsComponent } from './pages/veiculo-details/veiculo-details';
import { MotoristaDetailsComponent } from './pages/motorista-details/motorista-details';
import { AbastecimentoFormComponent } from './pages/abastecimento-form/abastecimento-form';

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
    path: 'admin/veiculos/editar/:id',
    component: VehicleFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'motorista/dashboard',
    component: MotoristaDashboardComponent, // Deve usar o nome da CLASSE, não do arquivo
    canActivate: [authGuard]
  },
  {
    path: 'admin/motoristas/novo',
    component: MotoristaFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/motoristas/editar/:id',
    component: MotoristaFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'agendamentos/detalhes/:id',
    component: AgendamentoDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/agendamentos/novo',
    component: AgendamentoFormComponent,
    canActivate: [authGuard]
  },

  {
    path: 'admin/manutencoes/novo/:veiculoId',
    component: ManutencaoFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/veiculos/:veiculoId/manutencoes', // Rota para a nova página
    component: VeiculoManutencoesComponent,
    canActivate: [authGuard]
  },
  {
    path: 'motorista/ocorrencias/nova',
    component: OcorrenciaFormComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/veiculos/detalhes/:id',
    component: VeiculoDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/motoristas/detalhes/:id',
    component: MotoristaDetailsComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin/abastecimentos/novo/:veiculoId',
    component: AbastecimentoFormComponent,
    canActivate: [authGuard]
  },

  // Rotas de redirecionamento no final
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];