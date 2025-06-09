// DTOs para os objetos aninhados, conforme a resposta da API
interface VeiculoResumo {
    id: number;
    placa: string;
}

interface MotoristaResumo {
    id: number;
    nome: string;
}

export interface Agendamento {
    id: number;
    veiculo: VeiculoResumo;
    motorista: MotoristaResumo;
    dataHoraSaida: string; // A data virá como string no formato ISO
    destino: string;
    status: 'AGENDADO' | 'EM_USO' | 'FINALIZADO' | 'CANCELADO';
}