import { Component, OnInit, inject, NgZone } from '@angular/core'; // 1. Importar NgZone
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { MotoristaService } from '../../services/motorista';
import { Motorista } from '../../models/motorista.model';
import { ViaCepService } from '../../services/via-cep';
import { NgxMaskDirective } from 'ngx-mask';

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
  private zone = inject(NgZone); // 2. Injetar o NgZone

  // Propriedades do componente
  motorista: Partial<Motorista> = {};
  isEditMode = false;
  errorMessage: string | null = null;
  novaSenha = '';
  today: string = ''; // Propriedade para a data mínima

  ngOnInit(): void {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    // getMonth() retorna 0-11, então adicionamos 1. padStart garante o formato "0M" se o mês for menor que 10.
    const mes = (dataAtual.getMonth() + 1).toString().padStart(2, '0');
    // padStart garante o formato "0D" se o dia for menor que 10.
    const dia = dataAtual.getDate().toString().padStart(2, '0');

    // Monta a string no formato YYYY-MM-DD
    this.today = `${ano}-${mes}-${dia}`;

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
      this.motorista = {
        nomeCompleto: '',
        email: '',
        cpf: '',
        cnhNumero: '',
        cnhValidade: '',
        telefone: '',
        cep: '',
        status: 'ATIVO'
      };
    }
  }

  onCepBlur(): void {
    // Ponto de verificação 1: A função foi chamada?
    console.log('---[DEBUG]--- Passo 1: onCepBlur foi chamado.');

    const cep = this.motorista.cep;

    // Ponto de verificação 2: Qual é o valor do CEP que estamos usando?
    console.log(`---[DEBUG]--- Passo 2: CEP capturado do formulário: "${cep}"`);

    // Usaremos uma condição de guarda mais simples para garantir que não seja o problema
    if (cep && cep.length >= 8) {

      // Ponto de verificação 3: Estamos prestes a chamar o serviço?
      console.log('---[DEBUG]--- Passo 3: Condição válida. Chamando o ViaCepService...');

      this.viaCepService.consultarCep(cep).subscribe({
        next: (data) => {
          // Ponto de verificação 4 (SUCESSO): Recebemos uma resposta da API?
          console.log('---[DEBUG]--- Passo 4 (SUCESSO): Dados recebidos do ViaCEP:', data);

          this.zone.run(() => {
            if (!data.erro) {
              this.motorista = {
                ...this.motorista,
                logradouro: data.logradouro,
                bairro: data.bairro,
                localidade: data.localidade,
                uf: data.uf
              };
              this.errorMessage = null;
            } else {
              this.errorMessage = 'CEP não encontrado.';
              this.limparCamposEndereco();
            }
          });
        },
        error: (err) => {
          // Ponto de verificação 4 (ERRO): A chamada da API falhou?
          console.error('---[DEBUG]--- Passo 4 (ERRO): A chamada para a API ViaCEP falhou.', err);

          this.zone.run(() => {
            this.errorMessage = 'Erro ao consultar o CEP. Verifique o console para mais detalhes.';
            this.limparCamposEndereco();
          });
        }
      });
    } else {
      // Ponto de verificação 3 (FALHA): A condição não foi atendida.
      console.log('---[DEBUG]--- Passo 3 (FALHA): CEP inválido ou curto demais. Serviço não foi chamado.');
    }
  }

  limparCamposEndereco(): void {
    this.motorista = {
      ...this.motorista,
      logradouro: '',
      bairro: '',
      localidade: '',
      uf: ''
    };
  }

  onSemNumeroChange(): void {
    if (this.motorista.semNumero) {
      // Se o checkbox for marcado, define o número como 'S/N' e o torna somente leitura (via [disabled])
      this.motorista.numero = 'S/N';
    } else {
      // Se desmarcado, limpa o campo número para o usuário digitar
      this.motorista.numero = '';
    }
  }

  onSubmit(): void {
    this.errorMessage = null;

    if (this.motorista.nomeCompleto && this.motorista.nomeCompleto.trim() === '') {
      this.errorMessage = 'Erro: O campo Nome Completo não pode conter apenas espaços.';
      return; // Interrompe a submissão
    }

    if (this.motorista.cnhValidade) {
      // Cria uma data para "hoje" sem levar em conta as horas, para uma comparação justa.
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      // Cria a data de validade a partir do valor do formulário.
      // Adicionar 'T00:00:00' ajuda a evitar problemas de fuso horário na conversão.
      const dataValidade = new Date(this.motorista.cnhValidade + 'T00:00:00');

      if (dataValidade < hoje) {
        this.errorMessage = 'Erro: A data de validade da CNH não pode ser uma data passada.';
        return; // INTERROMPE a submissão do formulário aqui mesmo.
      }
    }
    // Lógica de submit continua a mesma
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
      next: () => this.router.navigate(['/admin/dashboard']),
      error: (err) => {
        this.errorMessage = `Erro ao salvar: ${err.error?.message || 'Verifique os dados e tente novamente.'}`;
        delete this.motorista.senha;
      }
    });
  }
}