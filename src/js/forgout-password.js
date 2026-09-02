document.addEventListener('DOMContentLoaded', () => {
    const btnSend = document.querySelector('.btn-send');
    const btnCancel = document.querySelector('.btn-cancel');

    const inputEmail = document.querySelector('input[name="email"]') || document.querySelectorAll('.info input')[0];
    const inputCpf = document.querySelector('input[name="cpf"]') || document.querySelectorAll('.info input')[1];
    const inputNovaSenha = document.querySelector('input[name="senha"]') || document.querySelectorAll('.info input')[2];
    const inputConfirmarNovaSenha = document.querySelector('input[name="confirmar-senha"]') || document.querySelectorAll('.info input')[3];

    btnSend?.addEventListener('click', function(e) {
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

        const usuarios = JSON.parse(localStorage.getItem('usuarios_biblioteca')) || [];
        const usuario = usuarios.find(user => user.email === email && user.cpf === cpf);

        if (usuario) {
            usuario.senha = novaSenha;
            localStorage.setItem('usuarios_biblioteca', JSON.stringify(usuarios));
            
            alert('Senha redefinida com sucesso!');
            window.location.href = './login.html';
            return;
        }

        alert('Usuário não encontrado com esse E-mail e CPF!');
    });

    btnCancel?.addEventListener('click', function(e) {
        e.preventDefault();
        window.location.href = './login.html';
    });
});