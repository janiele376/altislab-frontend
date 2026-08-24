const btnSend = document.querySelector('.btn-send');
const btnCancel = document.querySelector('.btn-cancel');

const inputs = document.querySelectorAll('.info input');
const inputEmail = inputs[0];
const inputCpf = inputs[1];
const inputNovaSenha = inputs[2];
const inputConfirmarNovaSenha = inputs[3];

btnSend.addEventListener('click', (e) => {
    e.preventDefault();

    const email = inputEmail.value.trim().toLowerCase();
    const cpf = inputCpf.value.trim();
    const novaSenha = inputNovaSenha.value.trim();
    const confirmarNovaSenha = inputConfirmarNovaSenha.value.trim();

    if (!email || !cpf || !novaSenha || !confirmarNovaSenha) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (novaSenha !== confirmarNovaSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    if (novaSenha.length < 6) {
        alert('A senha deve conter no mínimo 6 caracteres!');
        return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios_biblioteca')) || [];
    const indexUsuario = usuarios.findIndex(user => user.email === email && user.cpf === cpf);

    if (indexUsuario !== -1) {
        usuarios[indexUsuario].senha = novaSenha;
        localStorage.setItem('usuarios_biblioteca', JSON.stringify(usuarios));
        alert('Senha redefinida com sucesso!');
        window.location.href = './login.html';
    } else if (email === 'admin@admin.com' || email === 'user@user.com') {
        alert('Senha de acesso de teste redefinida com sucesso!');
        window.location.href = './login.html';
    } else {
        alert('Usuário não encontrado com os dados informados!');
    }
});

btnCancel.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = './login.html';
});