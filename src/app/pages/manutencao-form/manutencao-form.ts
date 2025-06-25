import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ManutencaoRequest, TipoManutencao } from '../../models/manutencao.model';
import { ManutencaoService } from '../../services/manutencao';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';

@Component({
  selector: 'app-manutencao-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxMaskDirective],
  templateUrl: './manutencao-form.html',
  styleUrls: ['./manutencao-form.css']
})
export class ManutencaoFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private manutencaoService = inject(ManutencaoService);
  private toastr = inject(ToastrService);

  manutencao: ManutencaoRequest = {
    veiculoId: 0,
    data: new Date().toISOString().split('T')[0], // Padrão para hoje
    tipo: 'PREVENTIVA',
    descricao: '',
    valor: 0,
    quilometragem: 0
  };

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
    const payload = { ...this.manutencao };

    // Limpa a formatação da máscara antes de converter para número
    payload.quilometragem = Number(String(payload.quilometragem).replace(/\./g, ''));
    payload.valor = Number(String(payload.valor).replace(/\./g, '').replace(',', '.'));

    this.manutencaoService.registrarManutencao(this.manutencao).subscribe({
      next: () => {
        // 3. Exibe uma notificação de SUCESSO
        this.toastr.success('Manutenção registrada com sucesso!');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        // 4. Exibe uma notificação de ERRO
        const errorMessage = err.error?.message || 'Não foi possível salvar o registro. Verifique os dados.';
        this.toastr.error(errorMessage, 'Erro');
      }
    });
  }
}