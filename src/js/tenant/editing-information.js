document.addEventListener('DOMContentLoaded', () => {
    const nameUserEl = document.querySelector('.name-user');
    const inputs = document.querySelectorAll('.inputs-profile input');
    
    const inputEmail = inputs[0];
    const inputTelefone = inputs[1];
    const inputDataNasc = inputs[2];
    const inputCpf = inputs[3];
    const inputEndereco = inputs[4];

    const btnConfirm = document.querySelector('.btn-confirm');
    const btnCancel = document.querySelector('.btn-cancel');

    const usuarios = JSON.parse(localStorage.getItem('usuarios_biblioteca')) || [];
    let usuarioAtual = usuarios.length > 0 ? usuarios[usuarios.length - 1] : null;

    if (usuarioAtual) {
        if (nameUserEl) nameUserEl.textContent = usuarioAtual.nome || 'Maria Silva';
        inputEmail.value = usuarioAtual.email || '';
        inputTelefone.value = usuarioAtual.telefone || '';
        inputDataNasc.value = usuarioAtual.dataNasc || '';
        inputCpf.value = usuarioAtual.cpf || '';
        inputEndereco.value = usuarioAtual.localizacao || '';
    }

    btnConfirm?.addEventListener('click', (e) => {
        e.preventDefault();

        const email = inputEmail.value.trim();
        const telefone = inputTelefone.value.trim();
        const dataNasc = inputDataNasc.value;
        const cpf = inputCpf.value.trim();
        const localizacao = inputEndereco.value.trim();

        if (!email || !telefone || !dataNasc || !cpf || !localizacao) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (usuarioAtual) {
            usuarioAtual.email = email;
            usuarioAtual.telefone = telefone;
            usuarioAtual.dataNasc = dataNasc;
            usuarioAtual.cpf = cpf;
            usuarioAtual.localizacao = localizacao;

            usuarios[usuarios.length - 1] = usuarioAtual;
            localStorage.setItem('usuarios_biblioteca', JSON.stringify(usuarios));
        }

        alert('Informações atualizadas com sucesso!');
        window.location.href = './settings-profile.html';
    });

    btnCancel?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = './settings-profile.html';
    });
});