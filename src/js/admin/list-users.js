let STORAGE_KEY_USERS = '@biblioteca:usuarios';
let STORAGE_KEY_RENTALS = '@biblioteca:alugueis';

let containerList = document.querySelector('.container-list');
let inputSearch = document.querySelector('.input-search');

let modalStatus = document.getElementById('modal-status');
let closeBtnStatus = document.getElementById('close-modal-status');
let cancelBtnStatus = document.getElementById('cancel-status');
let confirmBtnStatus = document.getElementById('confirm-status');

let userNameEl = document.getElementById('status-user-name');
let userCpfEl = document.getElementById('status-user-cpf');
let statusMsgConfirmEl = document.getElementById('status-msg-confirm');
let statusMsgWarningEl = document.getElementById('status-msg-warning');

if (!statusMsgConfirmEl && modalStatus) {
    statusMsgConfirmEl = modalStatus.querySelector('.confirm-message p');
}

if (!statusMsgWarningEl && modalStatus) {
    statusMsgWarningEl = modalStatus.querySelector('.warning-text');
}

let selectedUserCpf = null;
let targetNewStatus = null;

function getUsers() {
    let data = localStorage.getItem(STORAGE_KEY_USERS);
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

function saveUsers(data) {
    let textoJson = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY_USERS, textoJson);
}

function getRentals() {
    let data = localStorage.getItem(STORAGE_KEY_RENTALS);
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

function formatDateBR(dateStr) {
    if (!dateStr) {
        return '-';
    }
    let parts = dateStr.split('-');
    if (parts.length != 3) {
        return dateStr;
    }
    return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function hasOverdueRental(userCpf, userName) {
    let rentals = getRentals();
    let cleanUserCpf = '';
    if (userCpf) {
        cleanUserCpf = userCpf.split('.').join('').split('-').join('').split(' ').join('');
    }

    let dataHoje = new Date();
    let ano = dataHoje.getFullYear();
    let mes = String(dataHoje.getMonth() + 1).padStart(2, '0');
    let dia = String(dataHoje.getDate()).padStart(2, '0');
    let today = ano + '-' + mes + '-' + dia;

    let nomeComparar = (userName || '').trim().toLowerCase();

    for (let i = 0; i < rentals.length; i++) {
        let r = rentals[i];
        let rCpf = '';
        if (r.cpf) {
            rCpf = r.cpf.split('.').join('').split('-').join('').split(' ').join('');
        }

        let rNome = (r.userName || '').trim().toLowerCase();

        let matchCpf = cleanUserCpf != '' && rCpf == cleanUserCpf;
        let matchName = rNome == nomeComparar;
        let isUser = matchCpf || matchName;
        let isAtivo = r.status != 'Inativo';
        let isVencido = r.endDate && r.endDate < today;

        if (isUser && isAtivo && isVencido) {
            return true;
        }
    }

    return false;
}

function abrirModalStatus(nome, cpf, novoStatus) {
    selectedUserCpf = cpf;
    targetNewStatus = novoStatus;

    if (userNameEl) {
        userNameEl.textContent = nome;
    }
    if (userCpfEl) {
        userCpfEl.textContent = cpf;
    }

    if (novoStatus == 'Inativo') {
        let atrasado = hasOverdueRental(cpf, nome);
        if (atrasado) {
            if (statusMsgConfirmEl) {
                statusMsgConfirmEl.textContent = 'Este usuário possui livros com devolução em atraso!';
            }
            if (statusMsgWarningEl) {
                statusMsgWarningEl.textContent = 'O usuário será inativado por conta do atraso na devolução do livro.';
            }
        } else {
            if (statusMsgConfirmEl) {
                statusMsgConfirmEl.textContent = 'Deseja realmente desativar este usuário?';
            }
            if (statusMsgWarningEl) {
                statusMsgWarningEl.textContent = 'O usuário perderá o acesso caso seja desativado.';
            }
        }
    } else {
        if (statusMsgConfirmEl) {
            statusMsgConfirmEl.textContent = 'Deseja reativar este usuário?';
        }
        if (statusMsgWarningEl) {
            statusMsgWarningEl.textContent = 'O usuário voltará a ter acesso normal ao sistema.';
        }
    }

    if (modalStatus) {
        modalStatus.showModal();
    }
}

if (closeBtnStatus) {
    closeBtnStatus.onclick = function () {
        modalStatus.close();
    };
}

if (cancelBtnStatus) {
    cancelBtnStatus.onclick = function () {
        modalStatus.close();
    };
}

if (modalStatus) {
    modalStatus.onclick = function (e) {
        let rect = modalStatus.getBoundingClientRect();
        let clicouDentro = true;

        if (e.clientY < rect.top || e.clientY > rect.top + rect.height || e.clientX < rect.left || e.clientX > rect.left + rect.width) {
            clicouDentro = false;
        }

        if (clicouDentro == false) {
            modalStatus.close();
        }
    };
}

if (confirmBtnStatus) {
    confirmBtnStatus.onclick = function () {
        if (!selectedUserCpf || !targetNewStatus) {
            if (modalStatus) modalStatus.close();
            return;
        }

        let users = getUsers();
        for (let i = 0; i < users.length; i++) {
            if (users[i].cpf == selectedUserCpf) {
                users[i].status = targetNewStatus;
                break;
            }
        }

        saveUsers(users);

        selectedUserCpf = null;
        targetNewStatus = null;

        if (modalStatus) {
            modalStatus.close();
        }

        let busca = inputSearch ? inputSearch.value : '';
        renderList(busca);
    };
}

function renderList(query) {
    if (!containerList) return;

    let tabelas = containerList.querySelectorAll('.container-table');
    for (let i = 0; i < tabelas.length; i++) {
        tabelas[i].remove();
    }

    let linhasHr = containerList.querySelectorAll('.user-separator-hr');
    for (let i = 0; i < linhasHr.length; i++) {
        linhasHr[i].remove();
    }

    let pagination = containerList.querySelector('.btn-next-page');
    let users = getUsers();
    let filter = '';
    if (query) {
        filter = query.trim().toLowerCase();
    }

    let filtered = [];
    for (let i = 0; i < users.length; i++) {
        let u = users[i];
        let nome = (u.nome || u.name || '').toLowerCase();
        let cpf = (u.cpf || '').toLowerCase();
        let endereco = (u.endereco || '').toLowerCase();

        let matchNome = nome.indexOf(filter) != -1;
        let matchCpf = cpf.indexOf(filter) != -1;
        let matchEndereco = endereco.indexOf(filter) != -1;

        if (matchNome || matchCpf || matchEndereco) {
            filtered.push(u);
        }
    }

    for (let i = 0; i < filtered.length; i++) {
        let user = filtered[i];
        let statusTexto = user.status || 'Ativo';
        let isAtivo = statusTexto == 'Ativo';

        let nomeUser = user.nome || user.name || '-';
        let cpfUser = user.cpf || '-';
        let nascimentoUser = formatDateBR(user.nascimento || user.dataNascimento);
        let enderecoUser = user.endereco || '-';

        let textoTag = isAtivo ? 'ATIVADO' : 'DESATIVADO';
        let corTag = isAtivo ? '#2ecc71' : '#e74c3c';
        let classeStatus = isAtivo ? 'status-active' : 'status-inactive';

        let disabledAtivar = isAtivo ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : '';
        let disabledDesativar = !isAtivo ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : '';

        let row = document.createElement('div');
        row.className = 'container-table';
        row.innerHTML =
            '<p class="name-p">' + nomeUser + '</p>' +
            '<p class="cpf-p">' + cpfUser + '</p>' +
            '<p class="date-birth-p">' + nascimentoUser + '</p>' +
            '<p class="address-p">' + enderecoUser + '</p>' +
            '<p class="status-p ' + classeStatus + '" style="color: ' + corTag + '; font-weight: bold;">' +
            textoTag +
            '</p>' +
            '<div class="container-btns">' +
            '<button class="btn-activate" ' + disabledAtivar + '>ATIVAR</button>' +
            '<button class="btn-deactivate" ' + disabledDesativar + '>DESATIVAR</button>' +
            '</div>';

        let btnActivate = row.querySelector('.btn-activate');
        btnActivate.onclick = function () {
            abrirModalStatus(user.nome || user.name, user.cpf, 'Ativo');
        };

        let btnDeactivate = row.querySelector('.btn-deactivate');
        btnDeactivate.onclick = function () {
            abrirModalStatus(user.nome || user.name, user.cpf, 'Inativo');
        };

        let hr = document.createElement('hr');
        hr.className = 'user-separator-hr';

        if (pagination) {
            containerList.insertBefore(row, pagination);
            containerList.insertBefore(hr, pagination);
        } else {
            containerList.appendChild(row);
            containerList.appendChild(hr);
        }
    }
}

if (inputSearch) {
    inputSearch.oninput = function (e) {
        renderList(e.target.value);
    };
}

renderList('');