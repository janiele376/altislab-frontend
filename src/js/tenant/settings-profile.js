document.addEventListener('DOMContentLoaded', function () {
    let usuarioLogado = localStorage.getItem('usuario_logado');
    let usuario = null;

    if (usuarioLogado) {
        usuario = JSON.parse(usuarioLogado);
    } else {
        let listaUsuarios = localStorage.getItem('usuarios_biblioteca');
        if (listaUsuarios) {
            let usuarios = JSON.parse(listaUsuarios);
            if (usuarios.length > 0) {
                usuario = usuarios[usuarios.length - 1];
            }
        }
    }

    if (usuario) {
        let imgElemento = document.querySelector('.img-user');

        if (imgElemento) {
            let foto = usuario.foto;
            if (foto && foto.indexOf('data:image') == 0) {
                imgElemento.src = foto;
            } else {
                imgElemento.src = '../../imgs/user.svg';
            }

            imgElemento.onerror = function () {
                imgElemento.src = '../../imgs/user.svg';
            };
        }

        function formatarDataBR(dataStr) {
            if (!dataStr) {
                return '01/01/2000';
            }
            let partes = dataStr.split('-');
            if (partes.length == 3) {
                let ano = partes[0];
                let mes = partes[1];
                let dia = partes[2];
                return dia + '/' + mes + '/' + ano;
            }
            return dataStr;
        }

        let elNome = document.getElementById('profile-name');
        let elEmail = document.getElementById('profile-email');
        let elTelefone = document.getElementById('profile-phone');
        let elNasc = document.getElementById('profile-birth');
        let elCpf = document.getElementById('profile-cpf');
        let elEndereco = document.getElementById('profile-address');

        let nome = usuario.nome || 'Maria Silva';
        let email = usuario.email || 'maria.silva@email.com';
        let telefone = usuario.telefone || '(99) 99999-9999';
        let dataTexto = usuario.dataNasc || usuario.nascimento;
        let nascimento = formatarDataBR(dataTexto);
        let cpf = usuario.cpf || '000.000.000-00';
        let endereco = usuario.localizacao || usuario.endereco || 'Rua das Flores, 123 - Centro';

        function preencherTexto(elemento, valor) {
            if (!elemento) return;
            let rotuloSpan = elemento.querySelector('span');
            if (rotuloSpan) {
                elemento.innerHTML = '';
                elemento.appendChild(rotuloSpan);
                elemento.append(' ' + valor);
            } else {
                elemento.textContent = valor;
            }
        }

        preencherTexto(elNome, nome);
        preencherTexto(elEmail, email);
        preencherTexto(elTelefone, telefone);
        preencherTexto(elNasc, nascimento);
        preencherTexto(elCpf, cpf);
        preencherTexto(elEndereco, endereco);
    }
});