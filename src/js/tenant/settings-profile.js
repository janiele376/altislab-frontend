document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario_logado'))
        || JSON.parse(localStorage.getItem('usuarios_biblioteca'))?.slice(-1)[0];

    if (!usuario) return;

    const imgElemento = document.querySelector('.container-img-profile .img-user');
    if (imgElemento) {
        // Se for Base64 (foto da galeria), usa direto. Se for qualquer outra coisa ou caminho antigo, força o relativo correto
        if (usuario.foto && usuario.foto.startsWith('data:image')) {
            imgElemento.src = usuario.foto;
        } else {
            imgElemento.src = '../../imgs/user.svg';
        }

        // Fallback garantido caso o SVG falhe
        imgElemento.onerror = function () {
            this.onerror = null;
            this.src = '../../imgs/user.svg';
        };
    }

    const formatarDataBR = (dataStr) => {
        if (!dataStr) return '01/01/2000';
        const partes = dataStr.split('-');
        if (partes.length === 3) {
            return `${partes[2]}/${partes[1]}/${partes[0]}`;
        }
        return dataStr;
    };

    const campos = {
        'profile-name': usuario.nome || 'Maria Silva',
        'profile-email': usuario.email || 'maria.silva@email.com',
        'profile-phone': usuario.telefone || '(99) 99999-9999',
        'profile-birth': formatarDataBR(usuario.dataNasc || usuario.nascimento),
        'profile-cpf': usuario.cpf || '000.000.000-00',
        'profile-address': usuario.localizacao || usuario.endereco || 'Rua das Flores, 123 - Centro'
    };

    Object.entries(campos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            const rotuloSpan = elemento.querySelector('span');
            if (rotuloSpan) {
                elemento.innerHTML = '';
                elemento.appendChild(rotuloSpan);
                elemento.append(` ${valor}`);
            } else {
                elemento.textContent = valor;
            }
        }
    });
});