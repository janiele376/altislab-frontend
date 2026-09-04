document.addEventListener('DOMContentLoaded', () => {
    const nameUserEl = document.querySelector('.name-user');
    const profileImgEl = document.querySelector('.container-img-profile .img-user');

    const inputSenhaAntiga = document.getElementById('input-current-password');
    const inputSenhaNova = document.getElementById('input-new-password');
    const inputSenhaConfirma = document.getElementById('input-confirm-password');

    const btnConfirm = document.querySelector('.btn-confirm');
    const btnCancel = document.querySelector('.btn-cancel');

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

    const usuarios = JSON.parse(localStorage.getItem('usuarios_biblioteca')) ||
        JSON.parse(localStorage.getItem('@biblioteca:usuarios')) || [];
    const sessaoAtiva = JSON.parse(localStorage.getItem('usuario_logado'));
    let usuarioAtual = usuarios.find(u => u.email === sessaoAtiva?.email || (u.cpf && u.cpf === sessaoAtiva?.cpf)) || sessaoAtiva || usuarios[usuarios.length - 1];

    if (usuarioAtual) {
        if (nameUserEl) {
            nameUserEl.textContent = usuarioAtual.nome || 'Usuário';
        }

        if (profileImgEl) {
            // Se for Base64 (foto enviada), renderiza direto; senão, força o SVG relativo correto
            if (usuarioAtual.foto && usuarioAtual.foto.startsWith('data:image')) {
                profileImgEl.src = usuarioAtual.foto;
            } else {
                profileImgEl.src = '../../imgs/user.svg';
            }

            profileImgEl.onerror = function () {
                this.onerror = null;
                this.src = '../../imgs/user.svg';
            };

            profileImgEl.style.cursor = 'pointer';
            profileImgEl.title = 'Clique para alterar a foto';
        }

        const preencherInput = (name, valor) => {
            const input = document.querySelector(`.inputs-profile input[name="${name}"]`);
            if (input && valor) input.value = valor;
        };

        preencherInput('email', usuarioAtual.email);
        preencherInput('telefone', usuarioAtual.telefone);
        preencherInput('data-nascimento', usuarioAtual.dataNasc || usuarioAtual.nascimento);
        preencherInput('cpf', usuarioAtual.cpf);
        preencherInput('localizacao', usuarioAtual.localizacao || usuarioAtual.endereco);
    }

    let inputFoto = document.getElementById('input-edit-foto');
    if (!inputFoto) {
        inputFoto = document.createElement('input');
        inputFoto.type = 'file';
        inputFoto.id = 'input-edit-foto';
        inputFoto.accept = 'image/*';
        inputFoto.style.display = 'none';
        document.body.appendChild(inputFoto);
    }

    const containerFoto = document.querySelector('.wrapper-avatar-change') || profileImgEl;
    containerFoto?.addEventListener('click', () => {
        inputFoto.click();
    });

    let novaFotoBase64 = null;
    inputFoto.addEventListener('change', (e) => {
        const arquivo = e.target.files[0];
        if (arquivo) {
            const leitor = new FileReader();
            leitor.onload = (evento) => {
                novaFotoBase64 = evento.target.result;
                if (profileImgEl) {
                    profileImgEl.src = novaFotoBase64;
                }
            };
            leitor.readAsDataURL(arquivo);
        }
    });

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
        if (novaDataNasc) {
            usuarioAtual.dataNasc = novaDataNasc;
            usuarioAtual.nascimento = novaDataNasc;
        }
        if (novoCpf) usuarioAtual.cpf = novoCpf;
        if (novaLocalizacao) {
            usuarioAtual.localizacao = novaLocalizacao;
            usuarioAtual.endereco = novaLocalizacao;
        }

        // Sanitiza a foto salva
        if (novaFotoBase64) {
            usuarioAtual.foto = novaFotoBase64;
        } else if (!usuarioAtual.foto || !usuarioAtual.foto.startsWith('data:image')) {
            usuarioAtual.foto = '../../imgs/user.svg';
        }

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
            if (nova.length > 8) {
                alert('A nova senha deve ter no máximo 8 dígitos!');
                return;
            }
            usuarioAtual.senha = nova;
        }

        ['usuarios_biblioteca', '@biblioteca:usuarios'].forEach(chave => {
            const lista = JSON.parse(localStorage.getItem(chave)) || [];
            const index = lista.findIndex(u =>
                (u.cpf && u.cpf === usuarioAtual.cpf) ||
                (u.email && u.email.toLowerCase() === (sessaoAtiva?.email || usuarioAtual.email).toLowerCase())
            );
            if (index !== -1) {
                lista[index] = { ...lista[index], ...usuarioAtual };
                localStorage.setItem(chave, JSON.stringify(lista));
            }
        });

        localStorage.setItem('usuario_logado', JSON.stringify(usuarioAtual));

        alert('Informações atualizadas com sucesso!');
        window.location.href = './settings-profile.html';
    });

    btnCancel?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = './settings-profile.html';
    });
});