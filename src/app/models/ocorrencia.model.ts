export type StatusOcorrencia = 'ABERTA' | 'EM_ANALISE' | 'RESOLVIDA';

export interface Ocorrencia {
  id: number;
  veiculoId: number;
  veiculoPlaca: string;
  motoristaId: number;
  motoristaNome: string;
  descricao: string;
  dataHoraRegistro: string;
  status: StatusOcorrencia;
}

export interface OcorrenciaRequest {
  veiculoId: number;
  descricao: string;
}