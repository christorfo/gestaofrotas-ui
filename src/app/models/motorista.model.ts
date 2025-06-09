export interface Motorista {
    id: number;
    nomeCompleto: string;
    email: string;
    cpf: string;
    cnhNumero: string;
    cnhValidade: string; // A data virá como string no formato ISO
    telefone: string;
    status: 'ATIVO' | 'INATIVO';
    endereco?: string;
    cep?: string;
}