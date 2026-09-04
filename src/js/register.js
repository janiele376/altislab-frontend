document.addEventListener('DOMContentLoaded', function () {
    function configureToggleSenha(btnId, inputSelector) {
        const btn = document.getElementById(btnId);
        const input = document.querySelector(inputSelector);

        btn?.addEventListener('click', function () {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            btn.src = isPassword ? '../imgs/visibility.svg' : '../imgs/visibility_off.svg';
            btn.alt = isPassword ? 'Ocultar senha' : 'Mostrar senha';
        });
    }

    configureToggleSenha('toggle-password', 'input[name="senha"]');
    configureToggleSenha('toggle-confirm-password', 'input[name="confirmar-senha"]');

    const form = document.querySelector('form');
    const btnRegister = document.querySelector('button[name="btn-register"]');
    const btnCancel = document.querySelector('button[name="btn-cancel"]');

    const modalPhoto = document.getElementById('modal-photo');
    const previewPhoto = document.getElementById('preview-photo');
    const inputFilePhoto = document.getElementById('input-file-photo');
    const btnChooseGallery = document.getElementById('btn-choose-gallery');
    const btnConfirmPhoto = document.getElementById('btn-confirm-photo');
    const btnSkipPhoto = document.getElementById('btn-skip-photo');

    let novoLocatarioTemp = null;
    let fotoBase64 = '../../imgs/user.svg';

    function salvarUsuarioFinal(usuario) {
        const chaves = ['@biblioteca:usuarios', 'usuarios_biblioteca'];

        chaves.forEach(chave => {
            const lista = JSON.parse(localStorage.getItem(chave)) || [];
            lista.push(usuario);
            localStorage.setItem(chave, JSON.stringify(lista));
        });

        localStorage.setItem('usuario_logado', JSON.stringify(usuario));

        modalPhoto?.close();
        alert('Cadastro realizado com sucesso!');
        window.location.href = './tenant/dashboard-tenant.html';
    }

    btnRegister?.addEventListener('click', function (e) {
        e.preventDefault();

        if (!form) return;

        const formData = new FormData(form);
        const dados = Object.fromEntries(formData.entries());

        const temCampoVazio = Object.values(dados).some(valor => typeof valor === 'string' && !valor.trim());
        if (temCampoVazio) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (dados['senha'] !== dados['confirmar-senha']) {
            alert('As senhas não coincidem!');
            return;
        }

        if (dados['senha'].length < 8) {
            alert('A senha deve conter exatamente 8 dígitos!');
            return;
        }

        novoLocatarioTemp = {
            id: String(Date.now()),
            nome: dados['nome-completo']?.trim(),
            nascimento: dados['data-nascimento'],
            dataNasc: dados['data-nascimento'],
            email: dados['email']?.trim().toLowerCase(),
            cpf: dados['cpf']?.trim(),
            telefone: dados['telefone']?.trim(),
            endereco: dados['localizacao']?.trim(),
            localizacao: dados['localizacao']?.trim(),
            senha: dados['senha']?.trim(),
            tipo: 'locatario',
            status: 'Ativo',
            foto: '../../imgs/user.svg'
        };

        const usuarios = JSON.parse(localStorage.getItem('@biblioteca:usuarios')) ||
            JSON.parse(localStorage.getItem('usuarios_biblioteca')) || [];

        const cpfLimpo = novoLocatarioTemp.cpf.replace(/\D/g, '');
        const usuarioExiste = usuarios.some(u => {
            const uCpfLimpo = (u.cpf || '').replace(/\D/g, '');
            return (u.email && u.email.toLowerCase() === novoLocatarioTemp.email) ||
                (uCpfLimpo && uCpfLimpo === cpfLimpo);
        });

        if (usuarioExiste) {
            alert('Já existe uma conta cadastrada com este E-mail ou CPF!');
            return;
        }

        if (modalPhoto) {
            modalPhoto.showModal();
        } else {
            salvarUsuarioFinal(novoLocatarioTemp);
        }
    });

    btnChooseGallery?.addEventListener('click', () => {
        inputFilePhoto?.click();
    });

    inputFilePhoto?.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function (evt) {
                fotoBase64 = evt.target.result;
                if (previewPhoto) {
                    previewPhoto.src = fotoBase64;
                }
            };
            reader.readAsDataURL(file);
        }
    });

    btnConfirmPhoto?.addEventListener('click', () => {
        if (!novoLocatarioTemp) return;
        novoLocatarioTemp.foto = fotoBase64;
        salvarUsuarioFinal(novoLocatarioTemp);
    });

    btnSkipPhoto?.addEventListener('click', () => {
        if (!novoLocatarioTemp) return;
        novoLocatarioTemp.foto = '../../imgs/user.svg';
        salvarUsuarioFinal(novoLocatarioTemp);
    });

    btnCancel?.addEventListener('click', function (e) {
        e.preventDefault();
        window.location.href = './login.html';
    });
});