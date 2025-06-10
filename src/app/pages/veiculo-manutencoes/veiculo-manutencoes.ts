import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Manutencao } from '../../models/manutencao.model';
import { ManutencaoService } from '../../services/manutencao';

@Component({
  selector: 'app-veiculo-manutencoes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './veiculo-manutencoes.html',
  styleUrls: ['./veiculo-manutencoes.css']
})
export class VeiculoManutencoesComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private manutencaoService = inject(ManutencaoService);
  private location = inject(Location);

  manutencoes: Manutencao[] = [];
  veiculoId: string | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    this.veiculoId = this.route.snapshot.paramMap.get('veiculoId');
    if (this.veiculoId) {
      this.manutencaoService.getManutencoesPorVeiculo(Number(this.veiculoId)).subscribe({
        next: (data) => this.manutencoes = data,
        error: (err) => this.errorMessage = 'Falha ao carregar o histórico de manutenções.'
      });
    }
  }

  voltar(): void {
    this.location.back();
  }
}