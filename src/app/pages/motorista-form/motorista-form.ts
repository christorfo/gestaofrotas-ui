import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgxMaskDirective } from 'ngx-mask';

import { MotoristaService } from '../../services/motorista';
import { Motorista } from '../../models/motorista.model';
import { ViaCepService } from '../../services/via-cep';


@Component({
  selector: 'app-motorista-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxMaskDirective],
  templateUrl: './motorista-form.html',
  styleUrls: ['./motorista-form.css']
})
export class MotoristaFormComponent implements OnInit {
  private motoristaService = inject(MotoristaService);
  private viaCepService = inject(ViaCepService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private zone = inject(NgZone);
  private toastr = inject(ToastrService);

  motorista: Partial<Motorista> = {};
  isEditMode = false;
  novaSenha = '';
  today = '';

  ngOnInit(): void {
    // Lógica para validação de data
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const dia = dataAtual.getDate().toString().padStart(2, '0');
    this.today = `${ano}-${mes}-${dia}`;

    const motoristaId = this.route.snapshot.paramMap.get('id');
    if (motoristaId) {
      this.isEditMode = true;
      this.motoristaService.getMotoristaById(Number(motoristaId)).subscribe(data => {
        // Formata a data de validade para o input
        if (data.cnhValidade) {
          data.cnhValidade = data.cnhValidade.split('T')[0];
        }
        this.motorista = data;

        // Se o motorista carregado tiver um CEP, chama a função de busca de endereço
        if (this.motorista.cep) {
          this.onCepBlur();
        }
      });
    } else {
      this.isEditMode = false;
      this.motorista = { semNumero: false, status: 'ATIVO' };
    }
  }

  onCepBlur(): void {
    const cep = this.motorista.cep;
    if (cep && cep.length >= 8) {
      this.viaCepService.consultarCep(cep).subscribe({
        next: (data) => {
          this.zone.run(() => {
            if (data.erro) {
              this.toastr.error('CEP não encontrado.', 'Erro de CEP');
              this.limparCamposEndereco();
            } else {
              this.motorista = {
                ...this.motorista,
                logradouro: data.logradouro,
                bairro: data.bairro,
                localidade: data.localidade,
                uf: data.uf
              };
            }
          });
        },
        error: () => {
          this.zone.run(() => {
            this.toastr.error('Erro ao consultar o serviço de CEP.', 'Erro de Serviço');
            this.limparCamposEndereco();
          });
        }
      });
    }
  }

  limparCamposEndereco(): void {
    this.motorista.logradouro = '';
    this.motorista.bairro = '';
    this.motorista.localidade = '';
    this.motorista.uf = '';
  }

  onSemNumeroChange(): void {
    if (this.motorista.semNumero) {
      this.motorista.numero = 'S/N';
    } else {
      this.motorista.numero = '';
    }
  }

  onSubmit(): void {
    // Validação 1: Garante que o nome não contém apenas espaços
    if (this.motorista.nomeCompleto && this.motorista.nomeCompleto.trim() === '') {
      this.toastr.error('O campo Nome Completo não pode conter apenas espaços.', 'Erro de Validação');
      return; // Interrompe a submissão
    }

    // Validação 2: Garante que a data de validade da CNH não está no passado
    if (this.motorista.cnhValidade) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0); // Zera a hora para comparar apenas a data
      const dataValidade = new Date(this.motorista.cnhValidade + 'T00:00:00');

      if (dataValidade < hoje) {
        this.toastr.error('A data de validade da CNH não pode ser uma data passada.', 'Erro de Validação');
        return; // Interrompe a submissão
      }
    }

    // Monta a string de endereço completo
    const enderecoCompleto = `${this.motorista.logradouro || ''}, ${this.motorista.numero || ''} - ${this.motorista.bairro || ''}, ${this.motorista.localidade || ''}/${this.motorista.uf || ''}`;

    const payload: Partial<Motorista> = {
      ...this.motorista,
      endereco: enderecoCompleto,
    };

    // Remove campos que são apenas para a UI
    delete payload.logradouro;
    delete payload.bairro;
    delete payload.localidade;
    delete payload.uf;
    delete payload.numero;
    delete payload.semNumero;

    // Lógica de senha
    if (this.novaSenha) {
      payload.senha = this.novaSenha;
    } else {
      delete payload.senha;
    }

    const operation = this.isEditMode
      ? this.motoristaService.updateMotorista(payload.id!, payload)
      : this.motoristaService.createMotorista(payload);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Motorista atualizado com sucesso!' : 'Motorista criado com sucesso!';
        this.toastr.success(message, 'Sucesso');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        this.toastr.error(err.error?.message || 'Não foi possível salvar. Verifique os dados.', 'Erro ao Salvar');
      }
    });
  }
}