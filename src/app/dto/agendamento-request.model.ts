export interface AgendamentoRequest {
  veiculoId: number;
  motoristaId: number;
  dataHoraSaida: string;
  destino: string;
  justificativa: string;
}