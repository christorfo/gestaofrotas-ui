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
  location = inject(Location); // Para o botão "Voltar"

  veiculo: Veiculo | null = null;
  errorMessage: string | null = null;

  ngOnInit(): void {
    const veiculoId = this.route.snapshot.paramMap.get('id');
    if (veiculoId) {
      this.veiculoService.getVeiculoById(Number(veiculoId)).subscribe({
        next: (data) => this.veiculo = data,
        error: (err) => this.errorMessage = 'Veículo não encontrado.'
      });
    }
  }
}