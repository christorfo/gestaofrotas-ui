export interface Motorista {
    numero?: string;
    semNumero?: boolean;
    id: number;
    nomeCompleto: string;
    email: string;
    cpf: string;
    cnhNumero: string;
    cnhValidade: string;
    telefone: string;
    status: 'ATIVO' | 'INATIVO';
    endereco?: string;
    cep?: string;
    senha?: string;
    logradouro?: string;
    bairro?: string;
    localidade?: string; // Cidade
    uf?: string; // Estado
}