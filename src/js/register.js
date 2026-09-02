document.addEventListener('DOMContentLoaded', function() {
    function configureToggleSenha(btnId, inputSelector) {
        const btn = document.getElementById(btnId);
        const input = document.querySelector(inputSelector);

        btn?.addEventListener('click', function() {
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

    btnRegister?.addEventListener('click', function(e) {
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
            alert('A senha deve conter no mínimo 8 caracteres!');
            return;
        }

        const novoLocatario = {
            nome: dados['nome-completo']?.trim(),
            dataNasc: dados['data-nascimento'],
            email: dados['email']?.trim().toLowerCase(),
            cpf: dados['cpf']?.trim(),
            telefone: dados['telefone']?.trim(),
            localizacao: dados['localizacao']?.trim(),
            senha: dados['senha']?.trim(),
            tipo: 'locatario',
            status: 'Ativo'
        };

        const usuarios = JSON.parse(localStorage.getItem('usuarios_biblioteca')) || [];

        const usuarioExiste = usuarios.some(
            usuario => usuario.email === novoLocatario.email || usuario.cpf === novoLocatario.cpf
        );

        if (usuarioExiste) {
            alert('Já existe uma conta cadastrada com este E-mail ou CPF!');
            return;
        }

        usuarios.push(novoLocatario);
        localStorage.setItem('usuarios_biblioteca', JSON.stringify(usuarios));

        alert('Cadastro realizado com sucesso!');
        window.location.href = './login.html';
    });

    btnCancel?.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = './login.html';
    });
});