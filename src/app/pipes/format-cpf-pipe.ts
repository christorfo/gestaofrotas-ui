import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatCpf',
  standalone: true
})
export class FormatCpfPipe implements PipeTransform {

  transform(value: string | null | undefined): string {
    if (!value) {
      return '';
    }

    // Remove qualquer caractere que não seja um dígito
    const cpfNumerico = value.replace(/\D/g, '');

    // Se o CPF não tiver 11 dígitos, retorna o que foi digitado sem formatar
    if (cpfNumerico.length !== 11) {
      return value;
    }

    // Aplica a máscara XXX.XXX.XXX-XX
    return cpfNumerico.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }

}