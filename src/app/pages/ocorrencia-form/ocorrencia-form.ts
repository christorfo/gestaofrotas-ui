import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Veiculo } from '../../models/veiculo.model';
import { VeiculoService } from '../../services/veiculo';
import { OcorrenciaRequest } from '../../models/ocorrencia.model';
import { OcorrenciaService } from '../../services/ocorrencia';

@Component({
  selector: 'app-ocorrencia-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ocorrencia-form.html',
  styleUrls: ['./ocorrencia-form.css']
})
export class OcorrenciaFormComponent implements OnInit {
  private veiculoService = inject(VeiculoService);
  private ocorrenciaService = inject(OcorrenciaService);
  private router = inject(Router);

  veiculos: Veiculo[] = [];
  ocorrencia: OcorrenciaRequest = {
    veiculoId: 0,
    descricao: ''
  };
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  carregarVeiculos(): void {
    this.veiculoService.getVeiculos().subscribe({
      next: (data) => {
        this.veiculos = data;
      },
      error: (err) => {
        this.errorMessage = 'Não foi possível carregar a lista de veículos.';
      }
    });
  }

  onSubmit(): void {
    this.ocorrenciaService.registrarOcorrencia(this.ocorrencia).subscribe({
      next: () => {
        console.log('Ocorrência registrada com sucesso!');
        alert('Ocorrência registrada com sucesso!'); // Feedback simples para o usuário
        this.router.navigate(['/motorista/dashboard']);
      },
      error: (err) => {
        this.errorMessage = `Erro ao registrar ocorrência: ${err.error?.message || 'Verifique os dados.'}`;
      }
    });
  }
}