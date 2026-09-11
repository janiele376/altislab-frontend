let inputEmail = document.getElementById('input-email');
let inputPassword = document.getElementById('input-password');
let btnLogin = document.getElementById('btn-login');
let btnRegister = document.getElementById('btn-register');
let togglePassword = document.getElementById('toggle-password');

if (togglePassword) {
    togglePassword.onclick = function (e) {
        e.preventDefault();

        if (inputPassword.type == 'password') {
            inputPassword.type = 'text';
            togglePassword.src = '../imgs/visibility.svg';
            togglePassword.alt = 'Ocultar senha';
        } else {
            inputPassword.type = 'password';
            togglePassword.src = '../imgs/visibility_off.svg';
            togglePassword.alt = 'Mostrar senha';
        }
    };
}

function getUsuariosCadastrados() {
    let dados = localStorage.getItem('@biblioteca:usuarios');

    if (!dados) {
        dados = localStorage.getItem('usuarios_biblioteca');
    }
    if (!dados) {
        dados = localStorage.getItem('usuarios');
    }

    if (dados) {
        let lista = JSON.parse(dados);
        return lista;
    }

    return [];
}

function atualizarUsuariosNoStorage(usuariosAtualizados) {
    let textoJson = JSON.stringify(usuariosAtualizados);
    localStorage.setItem('@biblioteca:usuarios', textoJson);
    localStorage.setItem('usuarios_biblioteca', textoJson);
}

function usuarioPossuiAtraso(usuario) {
    let dadosAlugueis = localStorage.getItem('@biblioteca:alugueis');

    if (!dadosAlugueis) {
        return false;
    }

    let alugueis = JSON.parse(dadosAlugueis);

    let dataHoje = new Date();
    let ano = dataHoje.getFullYear();
    let mes = String(dataHoje.getMonth() + 1).padStart(2, '0');
    let dia = String(dataHoje.getDate()).padStart(2, '0');
    let hojeFormatado = ano + '-' + mes + '-' + dia;

    for (let i = 0; i < alugueis.length; i++) {
        let aluguel = alugueis[i];

        let ehMesmoCpf = false;
        if (usuario.cpf && aluguel.cpf && usuario.cpf == aluguel.cpf) {
            ehMesmoCpf = true;
        }

        let ehMesmoNome = false;
        let nomeUser = usuario.nome || usuario.name || '';
        let nomeAluguel = aluguel.userName || '';
        if (nomeUser.toLowerCase() == nomeAluguel.toLowerCase()) {
            ehMesmoNome = true;
        }

        let ehEsteUsuario = ehMesmoCpf || ehMesmoNome;
        let estaPendente = aluguel.status != 'Inativo';
        let estaAtrasado = aluguel.endDate && aluguel.endDate < hojeFormatado;

        if (ehEsteUsuario && estaPendente && estaAtrasado) {
            return true;
        }
    }

    return false;
}

if (btnLogin) {
    btnLogin.onclick = function (e) {
        e.preventDefault();

        let email = inputEmail.value.toLowerCase().trim();
        let senha = inputPassword.value.trim();

        if (email == '' || senha == '') {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (email == 'admin@admin.com' && senha == '12345678') {
            window.location.href = './admin/dashboard-admin.html';
            return;
        }

        if (email == 'user@user.com' && senha == '12345678') {
            window.location.href = './tenant/dashboard-tenant.html';
            return;
        }

        let usuarios = getUsuariosCadastrados();
        let usuarioEncontrado = null;

        for (let i = 0; i < usuarios.length; i++) {
            let u = usuarios[i];
            let emailBanco = (u.email || '').toLowerCase().trim();

            if (emailBanco == email && u.senha == senha) {
                usuarioEncontrado = u;
                break;
            }
        }

        if (usuarioEncontrado != null) {
            let temAtraso = usuarioPossuiAtraso(usuarioEncontrado);

            if (temAtraso == true) {
                usuarioEncontrado.status = 'Inativo';

                for (let i = 0; i < usuarios.length; i++) {
                    if (usuarios[i].email == usuarioEncontrado.email) {
                        usuarios[i].status = 'Inativo';
                    }
                }

                atualizarUsuariosNoStorage(usuarios);
                alert('Acesso negado: Este usuário foi inativado por conta do atraso na devolução do livro.');
                return;
            }

            let statusConta = usuarioEncontrado.status || 'Ativo';
            if (statusConta == 'Inativo' || statusConta == 'Desativado') {
                alert('Acesso negado: Sua conta está desativada. Entre em contato com a biblioteca.');
                return;
            }

            localStorage.setItem('usuario_logado', JSON.stringify(usuarioEncontrado));
            window.location.href = './tenant/dashboard-tenant.html';
            return;
        }

        alert('E-mail ou senha incorretos!');
    };
}

if (btnRegister) {
    btnRegister.onclick = function (e) {
        e.preventDefault();
        window.location.href = './register.html';
    };
}