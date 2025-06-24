import { Component, OnInit, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MotoristaService } from '../../services/motorista';
import { Motorista } from '../../models/motorista.model';
import { ViaCepService } from '../../services/via-cep';
import { NgxMaskDirective } from 'ngx-mask';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-motorista-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, NgxMaskDirective],
  templateUrl: './motorista-form.html',
  styleUrls: ['./motorista-form.css']
})
export class MotoristaFormComponent implements OnInit {
  // Injeções de dependência
  private motoristaService = inject(MotoristaService);
  private viaCepService = inject(ViaCepService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private zone = inject(NgZone);
  private toastr = inject(ToastrService);

  // Propriedades do componente
  motorista: Partial<Motorista> & { logradouro?: string; bairro?: string; localidade?: string; uf?: string; semNumero?: boolean; numero?: string } = {};
  isEditMode = false;
  novaSenha = '';
  today: string = '';

  // A propriedade 'errorMessage' foi removida, pois o Toastr cuidará dos feedbacks.

  ngOnInit(): void {
    const motoristaId = this.route.snapshot.paramMap.get('id');
    if (motoristaId) {
      this.isEditMode = true;
      this.motoristaService.getMotoristaById(Number(motoristaId)).subscribe(data => {
        if (data.cnhValidade) {
          data.cnhValidade = data.cnhValidade.split('T')[0];
        }
        this.motorista = data;
      });
    } else {
      this.isEditMode = false;
      this.motorista = { status: 'ATIVO' };
    }
  }

  onCepBlur(): void {

    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    const dia = dataAtual.getDate().toString().padStart(2, '0');
    this.today = `${ano}-${mes}-${dia}`;
    const cep = this.motorista.cep;
    if (cep && cep.length >= 8) {
      this.viaCepService.consultarCep(cep).subscribe({
        next: (data) => {
          this.zone.run(() => {
            if (data.erro) {
              this.toastr.error('CEP não encontrado.', 'Erro de CEP');
              this.limparCamposEndereco();
            } else {
              this.motorista.logradouro = data.logradouro;
              this.motorista.bairro = data.bairro;
              this.motorista.localidade = data.localidade;
              this.motorista.uf = data.uf;
            }
          });
        },
        error: (err) => {
          this.zone.run(() => {
            this.toastr.error('Erro ao consultar o serviço de CEP. Tente novamente mais tarde.', 'Erro de Serviço');
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
    // Validações de frontend com feedback via Toastr
    if (this.motorista.nomeCompleto && this.motorista.nomeCompleto.trim() === '') {
      this.toastr.error('O campo Nome Completo não pode conter apenas espaços.', 'Erro de Validação');
      return;
    }

    if (this.motorista.cnhValidade) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      const dataValidade = new Date(this.motorista.cnhValidade + 'T00:00:00');

      if (dataValidade < hoje) {
        this.toastr.error('A data de validade da CNH não pode ser uma data passada.', 'Erro de Validação');
        return;
      }
    }

    if (this.novaSenha) {
      this.motorista.senha = this.novaSenha;
    } else {
      delete this.motorista.senha;
    }

    const payload: Partial<Motorista> = { ...this.motorista };
    delete payload.logradouro;
    delete payload.bairro;
    delete payload.localidade;
    delete payload.uf;

    const operation = this.isEditMode
      ? this.motoristaService.updateMotorista(this.motorista.id!, payload)
      : this.motoristaService.createMotorista(payload);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode ? 'Motorista atualizado com sucesso!' : 'Motorista criado com sucesso!';
        this.toastr.success(message, 'Sucesso');
        this.router.navigate(['/admin/dashboard']);
      },
      error: (err) => {
        // Usa o Toastr para exibir a mensagem de erro vinda do backend ou uma mensagem padrão
        this.toastr.error(err.error || 'Não foi possível salvar. Verifique os dados e tente novamente.', 'Erro ao Salvar');
        delete this.motorista.senha;
      }
    });
  }
}