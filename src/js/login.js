document.addEventListener('DOMContentLoaded', function () {
    const inputEmail = document.getElementById('input-email');
    const inputPassword = document.getElementById('input-password');
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const togglePassword = document.getElementById('toggle-password');

    togglePassword?.addEventListener('click', function (e) {
        e.preventDefault();
        if (inputPassword.type === 'password') {
            inputPassword.type = 'text';
            togglePassword.src = '../imgs/visibility.svg';
            togglePassword.alt = 'Ocultar senha';
        } else {
            inputPassword.type = 'password';
            togglePassword.src = '../imgs/visibility_off.svg';
            togglePassword.alt = 'Mostrar senha';
        }
    });

    function getUsuariosCadastrados() {
        const chaves = ['@biblioteca:usuarios', 'usuarios_biblioteca', 'usuarios'];
        for (const chave of chaves) {
            const dados = localStorage.getItem(chave);
            if (dados) {
                try {
                    const parsed = JSON.parse(dados);
                    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
                } catch (err) {
                    console.error('Erro ao ler chave ' + chave, err);
                }
            }
        }
        return [];
    }

    function atualizarUsuariosNoStorage(usuariosAtualizados) {
        localStorage.setItem('@biblioteca:usuarios', JSON.stringify(usuariosAtualizados));
        localStorage.setItem('usuarios_biblioteca', JSON.stringify(usuariosAtualizados));
    }

    function usuarioPossuiAtraso(usuario) {
        const dadosAlugueis = localStorage.getItem('@biblioteca:alugueis');
        if (!dadosAlugueis) return false;

        try {
            const alugueis = JSON.parse(dadosAlugueis);
            const cpfLimpo = (usuario.cpf || '').replace(/\D/g, '');
            const nomeLimpo = (usuario.nome || usuario.name || '').trim().toLowerCase();
            const hoje = new Date().toISOString().split('T')[0];

            return alugueis.some(r => {
                const matchCpf = cpfLimpo && (r.cpf || '').replace(/\D/g, '') === cpfLimpo;
                const matchNome = (r.userName || '').trim().toLowerCase() === nomeLimpo;
                const ehUsuario = matchCpf || matchNome;
                const estaPendente = r.status !== 'Inativo';
                const estaAtrasado = r.endDate && r.endDate < hoje;

                return ehUsuario && estaPendente && estaAtrasado;
            });
        } catch (e) {
            return false;
        }
    }

    btnLogin?.addEventListener('click', function (e) {
        e.preventDefault();

        const email = inputEmail.value.trim().toLowerCase();
        const senha = inputPassword.value.trim();

        if (!email || !senha) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (email === 'admin@admin.com' && senha === '12345678') {
            window.location.href = './admin/dashboard-admin.html';
            return;
        }

        if (email === 'user@user.com' && senha === '12345678') {
            window.location.href = './tenant/dashboard-tenant.html';
            return;
        }

        const usuarios = getUsuariosCadastrados();

        const usuarioEncontrado = usuarios.find(
            usuario => (usuario.email || '').trim().toLowerCase() === email && usuario.senha === senha
        );

        if (usuarioEncontrado) {
            const temAtraso = usuarioPossuiAtraso(usuarioEncontrado);

            if (temAtraso) {
                usuarioEncontrado.status = 'Inativo';
                const listaAtualizada = usuarios.map(u =>
                    (u.cpf === usuarioEncontrado.cpf || u.email === usuarioEncontrado.email)
                        ? { ...u, status: 'Inativo' }
                        : u
                );
                atualizarUsuariosNoStorage(listaAtualizada);

                alert('Acesso negado: Este usuário foi inativado por conta do atraso na devolução do livro.');
                return;
            }

            const statusAtual = usuarioEncontrado.status || 'Ativo';
            if (statusAtual === 'Inativo' || statusAtual === 'Desativado') {
                alert('Acesso negado: Sua conta está desativada. Entre em contato com a biblioteca.');
                return;
            }

            localStorage.setItem('usuario_logado', JSON.stringify(usuarioEncontrado));
            window.location.href = './tenant/dashboard-tenant.html';
            return;
        }

        alert('E-mail ou senha incorretos!');
    });

    function openRegister(e) {
        e?.preventDefault();
        window.location.href = './register.html';
    }

    btnRegister?.addEventListener('click', openRegister);
});