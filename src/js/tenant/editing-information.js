let nameUserEl = document.querySelector('.name-user');
let profileImgEl = document.querySelector('.container-img-profile .img-user');

let inputSenhaAntiga = document.getElementById('input-current-password');
let inputSenhaNova = document.getElementById('input-new-password');
let inputSenhaConfirma = document.getElementById('input-confirm-password');

let btnConfirm = document.querySelector('.btn-confirm');
let btnCancel = document.querySelector('.btn-cancel');

let btnToggleAntiga = document.getElementById('toggle-current-password');
let btnToggleNova = document.getElementById('toggle-new-password');
let btnToggleConfirma = document.getElementById('toggle-confirm-password');

if (btnToggleAntiga && inputSenhaAntiga) {
    btnToggleAntiga.onclick = function () {
        if (inputSenhaAntiga.type == 'password') {
            inputSenhaAntiga.type = 'text';
            btnToggleAntiga.src = '../../imgs/visibility.svg';
            btnToggleAntiga.alt = 'Ocultar senha';
        } else {
            inputSenhaAntiga.type = 'password';
            btnToggleAntiga.src = '../../imgs/visibility_off.svg';
            btnToggleAntiga.alt = 'Mostrar senha';
        }
    };
}

if (btnToggleNova && inputSenhaNova) {
    btnToggleNova.onclick = function () {
        if (inputSenhaNova.type == 'password') {
            inputSenhaNova.type = 'text';
            btnToggleNova.src = '../../imgs/visibility.svg';
            btnToggleNova.alt = 'Ocultar senha';
        } else {
            inputSenhaNova.type = 'password';
            btnToggleNova.src = '../../imgs/visibility_off.svg';
            btnToggleNova.alt = 'Mostrar senha';
        }
    };
}

if (btnToggleConfirma && inputSenhaConfirma) {
    btnToggleConfirma.onclick = function () {
        if (inputSenhaConfirma.type == 'password') {
            inputSenhaConfirma.type = 'text';
            btnToggleConfirma.src = '../../imgs/visibility.svg';
            btnToggleConfirma.alt = 'Ocultar senha';
        } else {
            inputSenhaConfirma.type = 'password';
            btnToggleConfirma.src = '../../imgs/visibility_off.svg';
            btnToggleConfirma.alt = 'Mostrar senha';
        }
    };
}

let modal = document.getElementById('supportModal');
let openModalBtn = document.getElementById('openModalBtn');
let closeModalBtn = document.getElementById('closeModalBtn');
let supportForm = null;

if (modal) {
    supportForm = modal.querySelector('form');
}

if (openModalBtn && modal) {
    openModalBtn.onclick = function () {
        modal.showModal();
    };
}

if (closeModalBtn && modal) {
    closeModalBtn.onclick = function () {
        modal.close();
    };
}

if (supportForm) {
    supportForm.onsubmit = function (e) {
        e.preventDefault();
        alert('Sua mensagem foi enviada ao suporte com sucesso!');
        supportForm.reset();
        if (modal) {
            modal.close();
        }
    };
}

let dadosUsuarios = localStorage.getItem('usuarios_biblioteca');
if (!dadosUsuarios) {
    dadosUsuarios = localStorage.getItem('@biblioteca:usuarios');
}

let usuarios = [];
if (dadosUsuarios) {
    usuarios = JSON.parse(dadosUsuarios);
}

let dadosSessao = localStorage.getItem('usuario_logado');
let sessaoAtiva = null;
if (dadosSessao) {
    sessaoAtiva = JSON.parse(dadosSessao);
}

let usuarioAtual = null;

if (sessaoAtiva) {
    for (let i = 0; i < usuarios.length; i++) {
        let u = usuarios[i];
        let mesmoEmail = u.email && sessaoAtiva.email && u.email.toLowerCase() == sessaoAtiva.email.toLowerCase();
        let mesmoCpf = u.cpf && sessaoAtiva.cpf && u.cpf == sessaoAtiva.cpf;

        if (mesmoEmail || mesmoCpf) {
            usuarioAtual = u;
            break;
        }
    }
}

if (!usuarioAtual && sessaoAtiva) {
    usuarioAtual = sessaoAtiva;
}

if (!usuarioAtual && usuarios.length > 0) {
    usuarioAtual = usuarios[usuarios.length - 1];
}

if (usuarioAtual) {
    if (nameUserEl) {
        nameUserEl.textContent = usuarioAtual.nome || 'Usuário';
    }

    if (profileImgEl) {
        let foto = usuarioAtual.foto;
        if (foto && foto.indexOf('data:image') == 0) {
            profileImgEl.src = foto;
        } else {
            profileImgEl.src = '../../imgs/user.svg';
        }

        profileImgEl.onerror = function () {
            profileImgEl.src = '../../imgs/user.svg';
        };

        profileImgEl.style.cursor = 'pointer';
        profileImgEl.title = 'Clique para alterar a foto';
    }

    let inputEmail = document.querySelector('.inputs-profile input[name="email"]');
    let inputTelefone = document.querySelector('.inputs-profile input[name="telefone"]');
    let inputNasc = document.querySelector('.inputs-profile input[name="data-nascimento"]');
    let inputCpf = document.querySelector('.inputs-profile input[name="cpf"]');
    let inputLocalizacao = document.querySelector('.inputs-profile input[name="localizacao"]');

    if (inputEmail && usuarioAtual.email) {
        inputEmail.value = usuarioAtual.email;
    }
    if (inputTelefone && usuarioAtual.telefone) {
        inputTelefone.value = usuarioAtual.telefone;
    }
    if (inputNasc) {
        inputNasc.value = usuarioAtual.dataNasc || usuarioAtual.nascimento || '';
    }
    if (inputCpf && usuarioAtual.cpf) {
        inputCpf.value = usuarioAtual.cpf;
    }
    if (inputLocalizacao) {
        inputLocalizacao.value = usuarioAtual.localizacao || usuarioAtual.endereco || '';
    }
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

let containerFoto = document.querySelector('.wrapper-avatar-change');
if (!containerFoto) {
    containerFoto = profileImgEl;
}

if (containerFoto) {
    containerFoto.onclick = function () {
        inputFoto.click();
    };
}

let novaFotoBase64 = null;
inputFoto.onchange = function (e) {
    let arquivo = e.target.files[0];
    if (arquivo) {
        let leitor = new FileReader();
        leitor.onload = function (evento) {
            novaFotoBase64 = evento.target.result;
            if (profileImgEl) {
                profileImgEl.src = novaFotoBase64;
            }
        };
        leitor.readAsDataURL(arquivo);
    }
};

if (btnConfirm) {
    btnConfirm.onclick = function (e) {
        e.preventDefault();

        if (!usuarioAtual) {
            alert('Nenhum usuário logado encontrado!');
            return;
        }

        let inputEmail = document.querySelector('.inputs-profile input[name="email"]');
        let inputTelefone = document.querySelector('.inputs-profile input[name="telefone"]');
        let inputNasc = document.querySelector('.inputs-profile input[name="data-nascimento"]');
        let inputCpf = document.querySelector('.inputs-profile input[name="cpf"]');
        let inputLocalizacao = document.querySelector('.inputs-profile input[name="localizacao"]');

        let novoEmail = inputEmail ? inputEmail.value.trim() : '';
        let novoTelefone = inputTelefone ? inputTelefone.value.trim() : '';
        let novaDataNasc = inputNasc ? inputNasc.value.trim() : '';
        let novoCpf = inputCpf ? inputCpf.value.trim() : '';
        let novaLocalizacao = inputLocalizacao ? inputLocalizacao.value.trim() : '';

        if (novoEmail != '') {
            usuarioAtual.email = novoEmail.toLowerCase();
        }
        if (novoTelefone != '') {
            usuarioAtual.telefone = novoTelefone;
        }
        if (novaDataNasc != '') {
            usuarioAtual.dataNasc = novaDataNasc;
            usuarioAtual.nascimento = novaDataNasc;
        }
        if (novoCpf != '') {
            usuarioAtual.cpf = novoCpf;
        }
        if (novaLocalizacao != '') {
            usuarioAtual.localizacao = novaLocalizacao;
            usuarioAtual.endereco = novaLocalizacao;
        }

        if (novaFotoBase64 != null) {
            usuarioAtual.foto = novaFotoBase64;
        } else {
            let fotoAtual = usuarioAtual.foto;
            if (!fotoAtual || fotoAtual.indexOf('data:image') != 0) {
                usuarioAtual.foto = '../../imgs/user.svg';
            }
        }

        let antiga = inputSenhaAntiga ? inputSenhaAntiga.value.trim() : '';
        let nova = inputSenhaNova ? inputSenhaNova.value.trim() : '';
        let confirma = inputSenhaConfirma ? inputSenhaConfirma.value.trim() : '';

        if (antiga != '' || nova != '' || confirma != '') {
            if (antiga == '' || nova == '' || confirma == '') {
                alert('Para alterar sua senha, preencha a senha antiga, a nova senha e a confirmação!');
                return;
            }
            if (usuarioAtual.senha && usuarioAtual.senha != antiga) {
                alert('A senha antiga informada está incorreta!');
                return;
            }
            if (nova != confirma) {
                alert('A nova senha e a confirmação não coincidem!');
                return;
            }
            if (nova.length > 8) {
                alert('A nova senha deve ter no máximo 8 dígitos!');
                return;
            }
            usuarioAtual.senha = nova;
        }

        let lista1 = localStorage.getItem('usuarios_biblioteca');
        if (lista1) {
            let arr1 = JSON.parse(lista1);
            for (let i = 0; i < arr1.length; i++) {
                let u = arr1[i];
                let emailComparar = (sessaoAtiva && sessaoAtiva.email) ? sessaoAtiva.email : usuarioAtual.email;
                let mesmoCpf = u.cpf && usuarioAtual.cpf && u.cpf == usuarioAtual.cpf;
                let mesmoEmail = u.email && emailComparar && u.email.toLowerCase() == emailComparar.toLowerCase();

                if (mesmoCpf || mesmoEmail) {
                    arr1[i] = usuarioAtual;
                    break;
                }
            }
            localStorage.setItem('usuarios_biblioteca', JSON.stringify(arr1));
        }

        let lista2 = localStorage.getItem('@biblioteca:usuarios');
        if (lista2) {
            let arr2 = JSON.parse(lista2);
            for (let i = 0; i < arr2.length; i++) {
                let u = arr2[i];
                let emailComparar = (sessaoAtiva && sessaoAtiva.email) ? sessaoAtiva.email : usuarioAtual.email;
                let mesmoCpf = u.cpf && usuarioAtual.cpf && u.cpf == usuarioAtual.cpf;
                let mesmoEmail = u.email && emailComparar && u.email.toLowerCase() == emailComparar.toLowerCase();

                if (mesmoCpf || mesmoEmail) {
                    arr2[i] = usuarioAtual;
                    break;
                }
            }
            localStorage.setItem('@biblioteca:usuarios', JSON.stringify(arr2));
        }

        localStorage.setItem('usuario_logado', JSON.stringify(usuarioAtual));

        alert('Informações atualizadas com sucesso!');
        window.location.href = './settings-profile.html';
    };
}

if (btnCancel) {
    btnCancel.onclick = function (e) {
        e.preventDefault();
        window.location.href = './settings-profile.html';
    };
}