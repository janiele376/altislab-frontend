function aplicarMascaraCPF(input) {
    input.setAttribute('maxlength', '14');

    input.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');

        if (valor.length > 11) {
            valor = valor.slice(0, 11);
        }

        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
        valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');

        e.target.value = valor;
    });
}

function aplicarMascaraTelefone(input) {
    input.setAttribute('maxlength', '15');

    input.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');

        if (valor.length > 11) {
            valor = valor.slice(0, 11);
        }

        if (valor.length > 10) {
            valor = valor.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
        } else if (valor.length > 5) {
            valor = valor.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
        } else if (valor.length > 2) {
            valor = valor.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
        } else if (valor.length > 0) {
            valor = valor.replace(/^(\d*)/, '($1');
        }

        e.target.value = valor;
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const cpfs = document.querySelectorAll('input[name="cpf"], input[placeholder*="000.000.000-00"]');
    cpfs.forEach(input => aplicarMascaraCPF(input));

    const telefones = document.querySelectorAll('input[name="telefone"], input[placeholder*="0000-0000"], input[type="tel"]');
    telefones.forEach(input => {
        const isCpf = input.getAttribute('name') === 'cpf' || input.placeholder.includes('000.000.000-00');
        if (!isCpf) {
            aplicarMascaraTelefone(input);
        }
    });
});