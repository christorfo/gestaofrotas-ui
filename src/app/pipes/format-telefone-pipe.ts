import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTelefone',
  standalone: true
})
export class FormatTelefonePipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // Remove qualquer caractere que não seja um dígito
    const telefoneNumerico = value.replace(/\D/g, '');

    // Verifica se o telefone tem 11 dígitos (celular com 9º dígito)
    if (telefoneNumerico.length === 11) {
      return telefoneNumerico.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/, '($1) $2 $3-$4');
    }

    // Verifica se o telefone tem 10 dígitos (celular antigo ou fixo)
    if (telefoneNumerico.length === 10) {
      return telefoneNumerico.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }

    // Se não for nenhum dos formatos esperados, retorna o valor original
    return value;
  }

}