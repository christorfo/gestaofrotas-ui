// Interface para a requisição de criação
export interface AbastecimentoRequest {
  veiculoId: number;
  data: string;
  tipoCombustivel: string;
  valor: number;
  quilometragem: number;
  motoristaResponsavel: string;
}

// Interface para a resposta da API (se quisermos listar no futuro)
export interface Abastecimento {
  id: number;
  veiculoId: number;
  veiculoPlaca: string;
  data: string;
  tipoCombustivel: string;
  valor: number;
  quilometragem: number;
  motoristaResponsavel: string;
}