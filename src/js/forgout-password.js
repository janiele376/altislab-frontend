let btnSend = document.querySelector('.btn-send');
let btnCancel = document.querySelector('.btn-cancel');

let inputEmail = document.querySelector('input[name="email"]');
let inputCpf = document.querySelector('input[name="cpf"]');
let inputNovaSenha = document.querySelector('input[name="senha"]');
let inputConfirmarNovaSenha = document.querySelector('input[name="confirmar-senha"]');

if (btnSend) {
    btnSend.onclick = function (e) {
        e.preventDefault();

        let email = inputEmail.value.toLowerCase().trim();
        let cpf = inputCpf.value.trim();
        let novaSenha = inputNovaSenha.value.trim();
        let confirmarNovaSenha = inputConfirmarNovaSenha.value.trim();

        if (email == '' || cpf == '' || novaSenha == '' || confirmarNovaSenha == '') {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (novaSenha != confirmarNovaSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        let dados = localStorage.getItem('usuarios_biblioteca');
        let usuarios = [];

        if (dados) {
            usuarios = JSON.parse(dados);
        }

        let usuarioEncontrado = null;

        for (let i = 0; i < usuarios.length; i++) {
            let u = usuarios[i];
            let emailBanco = (u.email || '').toLowerCase().trim();
            let cpfBanco = (u.cpf || '').trim();

            if (emailBanco == email && cpfBanco == cpf) {
                usuarioEncontrado = u;
                break;
            }
        }

        if (usuarioEncontrado != null) {
            usuarioEncontrado.senha = novaSenha;

            let textoJson = JSON.stringify(usuarios);
            localStorage.setItem('usuarios_biblioteca', textoJson);

            alert('Senha redefinida com sucesso!');
            window.location.href = './login.html';
            return;
        }

        alert('Usuário não encontrado com esse E-mail e CPF!');
    };
}

if (btnCancel) {
    btnCancel.onclick = function (e) {
        e.preventDefault();
        window.location.href = './login.html';
    };
}