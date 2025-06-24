import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask'; // Importar para a máscara de valor
import { ToastrService } from 'ngx-toastr';

// Importar modelos e serviços necessários
import { AbastecimentoRequest } from '../../models/abastecimento.model';
import { AbastecimentoService } from '../../services/abastecimento';
import { VeiculoService } from '../../services/veiculo';
import { Veiculo } from '../../models/veiculo.model';
import { Motorista } from '../../models/motorista.model';
import { MotoristaService } from '../../services/motorista';

@Component({
  selector: 'app-abastecimento-form',
  standalone: true,
  // Adicionar NgxMaskDirective aos imports
  imports: [CommonModule, FormsModule, RouterLink, NgxMaskDirective],
  templateUrl: './abastecimento-form.html',
  styleUrls: ['./abastecimento-form.css']
})
export class AbastecimentoFormComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private abastecimentoService = inject(AbastecimentoService);
  private veiculoService = inject(VeiculoService);
  private motoristaService = inject(MotoristaService); // Injetar o serviço de motorista
  private toastr = inject(ToastrService);

  abastecimento: AbastecimentoRequest = {
    veiculoId: 0,
    data: new Date().toISOString().split('T')[0], // Data no formato YYYY-MM-DD
    tipoCombustivel: '',
    valor: 0,
    quilometragem: 0,
    motoristaResponsavel: ''
  };

  veiculo: Veiculo | null = null;
  motoristasAtivos: Motorista[] = []; // Array para o dropdown de motoristas

  // Lista de combustíveis para o dropdown
  readonly tiposDeCombustivel = ['Etanol', 'Gasolina Comum', 'Gasolina Aditivada', 'Diesel', 'GNV'];

  // errorMessage: string | null = null;

  ngOnInit(): void {
    const veiculoId = this.route.snapshot.paramMap.get('veiculoId');
    if (veiculoId) {
      this.abastecimento.veiculoId = Number(veiculoId);
      // Busca os dados do veículo
      this.veiculoService.getVeiculoById(Number(veiculoId)).subscribe(veiculo => {
        this.veiculo = veiculo;
        this.abastecimento.quilometragem = veiculo.quilometragemAtual;
      });
      // Busca os motoristas ativos para popular o dropdown
      this.carregarMotoristasAtivos();
    } else {
      this.router.navigate(['/admin/dashboard']);
    }
  }

  carregarMotoristasAtivos(): void {
    this.motoristaService.getMotoristas().subscribe(data => {
      this.motoristasAtivos = data.filter(m => m.status === 'ATIVO');
    });
  }

  onSubmit(): void {
    if (this.abastecimento.quilometragem < (this.veiculo?.quilometragemAtual ?? 0)) {
      // Também podemos usar o toastr para validações de frontend
      this.toastr.error('A quilometragem do abastecimento não pode ser menor que a atual.', 'Erro de Validação');
      return;
    }

    this.abastecimentoService.registrarAbastecimento(this.abastecimento).subscribe({
      next: () => {
        // 3. Notificação de SUCESSO
        this.toastr.success('Abastecimento registrado com sucesso!');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        // 4. Notificação de ERRO
        this.toastr.error(err.error?.message || 'Não foi possível salvar o registro.', 'Erro');
      }
    });
  }
}