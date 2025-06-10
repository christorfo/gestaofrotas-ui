// DTOs para os objetos aninhados, conforme a resposta da API
interface VeiculoResumo {
    id: number;
    placa: string;
    quilometragemAtual: number;
}

interface MotoristaResumo {
    id: number;
    nome: string;
}

export interface HistoricoStatus {
    statusNovo: string;
    dataHoraAlteracao: string;
    usuarioResponsavel: string;
}

export interface Agendamento {
    historicoStatus?: HistoricoStatus[];
    id: number;
    veiculo: VeiculoResumo;
    motorista: MotoristaResumo;
    dataHoraSaida: string; // A data virá como string no formato ISO
    destino: string;
    status: 'AGENDADO' | 'EM_USO' | 'FINALIZADO' | 'CANCELADO';
    // Adicionamos com '?' para indicar que são opcionais, pois podem ser nulas
    // dependendo do status do agendamento.
    dataHoraInicioViagem?: string;
    quilometragemSaida?: number;
    observacoesSaida?: string;
    dataHoraRetorno?: string;
    quilometragemFinal?: number;
    observacoesRetorno?: string;
    justificativa?: string;
}