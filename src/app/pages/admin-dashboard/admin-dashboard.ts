import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Veiculo } from '../../models/veiculo.model'; 
import { VeiculoService } from '../../services/veiculo';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  private veiculoService = inject(VeiculoService);

  veiculos: Veiculo[] = []; // Array para armazenar a lista de veículos
  errorMessage: string | null = null;

  // ngOnInit é um "gancho de ciclo de vida" que é executado quando o componente é inicializado.
  ngOnInit(): void {
    this.carregarVeiculos();
  }

  carregarVeiculos(): void {
    this.veiculoService.getVeiculos().subscribe({
      next: (data) => {
        this.veiculos = data;
        console.log('Veículos carregados:', this.veiculos);
      },
      error: (err) => {
        this.errorMessage = 'Falha ao carregar a lista de veículos. Verifique sua conexão ou token.';
        console.error(err);
      }
    });
  }
}