document.addEventListener('DOMContentLoaded', () => {
    const nameUserEl = document.querySelector('.name-user');
    
    const inputSenhaAntiga = document.getElementById('input-current-password');
    const inputSenhaNova = document.getElementById('input-new-password');
    const inputSenhaConfirma = document.getElementById('input-confirm-password');

    const btnConfirm = document.querySelector('.btn-confirm');
    const btnCancel = document.querySelector('.btn-cancel');

    // 1. Olhinhos para alternar visualização das senhas
    function setupPasswordToggle(toggleId, inputEl) {
        const btn = document.getElementById(toggleId);
        btn?.addEventListener('click', () => {
            if (!inputEl) return;
            const isPassword = inputEl.type === 'password';
            inputEl.type = isPassword ? 'text' : 'password';
            btn.src = isPassword ? '../../imgs/visibility.svg' : '../../imgs/visibility_off.svg';
            btn.alt = isPassword ? 'Ocultar senha' : 'Mostrar senha';
        });
    }

    setupPasswordToggle('toggle-current-password', inputSenhaAntiga);
    setupPasswordToggle('toggle-new-password', inputSenhaNova);
    setupPasswordToggle('toggle-confirm-password', inputSenhaConfirma);

    // 2. Modal de Suporte
    const modal = document.getElementById('supportModal');
    const supportForm = modal?.querySelector('form');

    document.getElementById('openModalBtn')?.addEventListener('click', () => modal?.showModal());
    document.getElementById('closeModalBtn')?.addEventListener('click', () => modal?.close());

    supportForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Sua mensagem foi enviada ao suporte com sucesso!');
        supportForm.reset();
        modal?.close();
    });

    const usuarios = JSON.parse(localStorage.getItem('usuarios_biblioteca')) || [];
    const sessaoAtiva = JSON.parse(localStorage.getItem('usuario_logado'));
    let usuarioAtual = usuarios.find(u => u.email === sessaoAtiva?.email) || usuarios[usuarios.length - 1];

    if (usuarioAtual && nameUserEl) {
        nameUserEl.textContent = usuarioAtual.nome || 'Usuário';
    }

    btnConfirm?.addEventListener('click', (e) => {
        e.preventDefault();

        if (!usuarioAtual) {
            alert('Nenhum usuário logado encontrado!');
            return;
        }

        const getValor = (name) => document.querySelector(`.inputs-profile input[name="${name}"]`)?.value.trim() || '';

        const novoEmail = getValor('email');
        const novoTelefone = getValor('telefone');
        const novaDataNasc = getValor('data-nascimento');
        const novoCpf = getValor('cpf');
        const novaLocalizacao = getValor('localizacao');

        if (novoEmail) usuarioAtual.email = novoEmail.toLowerCase();
        if (novoTelefone) usuarioAtual.telefone = novoTelefone;
        if (novaDataNasc) usuarioAtual.dataNasc = novaDataNasc;
        if (novoCpf) usuarioAtual.cpf = novoCpf;
        if (novaLocalizacao) usuarioAtual.localizacao = novaLocalizacao;

        const antiga = inputSenhaAntiga?.value.trim();
        const nova = inputSenhaNova?.value.trim();
        const confirma = inputSenhaConfirma?.value.trim();

        if (antiga || nova || confirma) {
            if (!antiga || !nova || !confirma) {
                alert('Para alterar sua senha, preencha a senha antiga, a nova senha e a confirmação!');
                return;
            }
            if (usuarioAtual.senha && usuarioAtual.senha !== antiga) {
                alert('A senha antiga informada está incorreta!');
                return;
            }
            if (nova !== confirma) {
                alert('A nova senha e a confirmação não coincidem!');
                return;
            }
            if (nova.length < 8) {
                alert('A nova senha deve ter no mínimo 8 caracteres!');
                return;
            }
            usuarioAtual.senha = nova;
        }

        localStorage.setItem('usuarios_biblioteca', JSON.stringify(usuarios));
        localStorage.setItem('usuario_logado', JSON.stringify(usuarioAtual));

        alert('Informações atualizadas com sucesso!');
        window.location.href = './settings-profile.html';
    });

    btnCancel?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = './settings-profile.html';
    });
});