import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Veiculo } from '../../models/veiculo.model';
import { VeiculoService } from '../../services/veiculo';

@Component({
  selector: 'app-veiculo-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './veiculo-details.html',
  styleUrls: ['./veiculo-details.css']
})
export class VeiculoDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private veiculoService = inject(VeiculoService);
  location = inject(Location);

  veiculo: Veiculo | null = null;
  errorMessage: string | null = null;
  isLoading = true; // 1. Adicionar e inicializar a propriedade isLoading

  ngOnInit(): void {
    const veiculoId = this.route.snapshot.paramMap.get('id');
    if (veiculoId) {
      this.veiculoService.getVeiculoById(Number(veiculoId)).subscribe({
        next: (data) => {
          this.veiculo = data;
          this.isLoading = false; // 2. Finaliza o carregamento com sucesso
        },
        error: (err) => {
          this.errorMessage = 'Veículo não encontrado.';
          this.isLoading = false; // 3. Finaliza o carregamento mesmo com erro
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'DISPONIVEL':
        return 'status-disponivel';
      case 'EM_MANUTENCAO':
        return 'status-manutencao';
      case 'INATIVO':
        return 'status-inativo';
      default:
        return '';
    }
  }
}