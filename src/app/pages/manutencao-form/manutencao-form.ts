import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ManutencaoRequest, TipoManutencao } from '../../models/manutencao.model';
import { ManutencaoService } from '../../services/manutencao';

@Component({
  selector: 'app-manutencao-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './manutencao-form.html',
  styleUrls: ['./manutencao-form.css']
})
export class ManutencaoFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private manutencaoService = inject(ManutencaoService);

  manutencao: ManutencaoRequest = {
    veiculoId: 0,
    data: new Date().toISOString().split('T')[0], // Padrão para hoje
    tipo: 'PREVENTIVA',
    descricao: '',
    valor: 0,
    quilometragem: 0
  };
  errorMessage: string | null = null;

  ngOnInit(): void {
    const veiculoId = this.route.snapshot.paramMap.get('veiculoId');
    if (veiculoId) {
      this.manutencao.veiculoId = Number(veiculoId);
    } else {
      // Se não houver ID, redireciona de volta, pois não sabemos para qual veículo registrar
      this.router.navigate(['/admin/dashboard']);
    }
  }

  onSubmit(): void {
    this.manutencaoService.registrarManutencao(this.manutencao).subscribe({
      next: () => {
        console.log('Manutenção registrada com sucesso!');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.errorMessage = `Erro ao registrar manutenção: ${err.error?.message || 'Verifique os dados.'}`;
      }
    });
  }
}