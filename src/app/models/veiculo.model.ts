export interface Veiculo {
    id: number;
    placa: string;
    modelo: string;
    tipo: string;
    ano: number;
    quilometragemAtual: number;
    status: 'DISPONIVEL' | 'EM_MANUTENCAO' | 'INATIVO';
}