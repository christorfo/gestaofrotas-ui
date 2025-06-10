export type TipoManutencao = 'PREVENTIVA' | 'CORRETIVA';

export interface Manutencao {
  id: number;
  veiculoId: number;
  veiculoPlaca: string;
  data: string;
  tipo: TipoManutencao;
  descricao: string;
  valor: number;
  quilometragem: number;
}

// DTO para a requisição de criação
export interface ManutencaoRequest {
  veiculoId: number;
  data: string;
  tipo: TipoManutencao;
  descricao: string;
  valor: number;
  quilometragem: number;
}