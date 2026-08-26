document.addEventListener('DOMContentLoaded', () => {
    const nameUserEl = document.querySelector('.name-user');
    const inputs = document.querySelectorAll('.inputs-profile input');
    
    const inputEmail = inputs[0];
    const inputTelefone = inputs[1];
    const inputDataNasc = inputs[2];
    const inputCpf = inputs[3];
    const inputEndereco = inputs[4];

    const inputSenhaAntiga = inputs[5];
    const inputSenhaNova = inputs[6];
    const inputSenhaConfirma = inputs[7];

    const btnConfirm = document.querySelector('.btn-confirm');
    const btnCancel = document.querySelector('.btn-cancel');

    const modal = document.getElementById('supportModal');
    const openModalBtn = document.getElementById('openModalBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const supportForm = modal ? modal.querySelector('form') : null;

    openModalBtn?.addEventListener('click', () => modal?.showModal());
    closeModalBtn?.addEventListener('click', () => modal?.close());

    supportForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        const supportEmail = document.getElementById('supportEmail').value.trim();
        const supportMessage = document.getElementById('supportMessage').value.trim();

        if (supportEmail && supportMessage) {
            alert('Sua mensagem foi enviada ao suporte com sucesso! Em breve entraremos em contato.');
            supportForm.reset();
            modal.close();
        }
    });

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

        const senhaAntiga = inputSenhaAntiga?.value.trim() || '';
        const senhaNova = inputSenhaNova?.value.trim() || '';
        const senhaConfirma = inputSenhaConfirma?.value.trim() || '';

        if (!email || !telefone || !dataNasc || !cpf || !localizacao) {
            alert('Por favor, preencha todos os campos do perfil!');
            return;
        }

        if (senhaAntiga || senhaNova || senhaConfirma) {
            if (!senhaAntiga || !senhaNova || !senhaConfirma) {
                alert('Para alterar sua senha, preencha a senha antiga, a nova senha e a confirmação!');
                return;
            }

            if (usuarioAtual && usuarioAtual.senha && usuarioAtual.senha !== senhaAntiga) {
                alert('A senha antiga informada está incorreta!');
                return;
            }

            if (senhaNova !== senhaConfirma) {
                alert('A nova senha e a confirmação não coincidem!');
                return;
            }

            if (usuarioAtual) {
                usuarioAtual.senha = senhaNova;
            }
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