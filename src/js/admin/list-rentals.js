function setupBackdropClose(dialogElement) {
    if (!dialogElement) return;
    dialogElement.onclick = function (e) {
        let rect = dialogElement.getBoundingClientRect();
        let clicouDentro = true;

        if (e.clientY < rect.top || e.clientY > rect.top + rect.height || e.clientX < rect.left || e.clientX > rect.left + rect.width) {
            clicouDentro = false;
        }

        if (clicouDentro == false) {
            dialogElement.close();
        }
    };
}

function getStoredArray(possibleKeys) {
    for (let i = 0; i < possibleKeys.length; i++) {
        let key = possibleKeys[i];
        let data = localStorage.getItem(key);
        if (data) {
            let parsed = JSON.parse(data);
            return parsed;
        }
    }
    return [];
}

function getRegisteredUsers() {
    let keys = ['@biblioteca:usuarios', 'usuarios', 'users'];
    return getStoredArray(keys);
}

function getRegisteredBooks() {
    let keys = ['@biblioteca:livros', 'livros', 'books'];
    return getStoredArray(keys);
}

function getRentals() {
    let keys = ['@biblioteca:alugueis', 'alugueis', 'rentals'];
    return getStoredArray(keys);
}

function saveRentals(data) {
    let textoJson = JSON.stringify(data);
    localStorage.setItem('@biblioteca:alugueis', textoJson);
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

function isAtrasado(rental) {
    if (rental.status == 'Inativo') {
        return false;
    }
    if (!rental.endDate) {
        return false;
    }

    let dataHoje = new Date();
    let ano = dataHoje.getFullYear();
    let mes = String(dataHoje.getMonth() + 1).padStart(2, '0');
    let dia = String(dataHoje.getDate()).padStart(2, '0');
    let hoje = ano + '-' + mes + '-' + dia;

    if (rental.endDate < hoje) {
        return true;
    }
    return false;
}

let containerList = document.querySelector('.container-list');
let inputSearch = document.querySelector('.input-search');
let activeTargetId = null;

let filterIcon = document.getElementById('btn-filter');
let filterDropdown = document.getElementById('filter-dropdown');
let selectFilterStatus = document.getElementById('filter-status');
let selectFilterSort = document.getElementById('filter-sort');
let btnApplyFilter = document.getElementById('btn-apply-filter');
let btnClearFilter = document.getElementById('btn-clear-filter');

function setupFilterUI() {
    if (!filterIcon || !filterDropdown) return;

    filterIcon.onclick = function (e) {
        e.stopPropagation();
        let displayAtual = filterDropdown.style.display;
        if (displayAtual == 'none' || displayAtual == '') {
            filterDropdown.style.display = 'flex';
        } else {
            filterDropdown.style.display = 'none';
        }
    };

    document.onclick = function (e) {
        if (filterDropdown && !filterDropdown.contains(e.target) && e.target != filterIcon) {
            filterDropdown.style.display = 'none';
        }
    };

    if (btnApplyFilter) {
        btnApplyFilter.onclick = function () {
            filterDropdown.style.display = 'none';
            let busca = inputSearch ? inputSearch.value : '';
            renderList(busca);
        };
    }

    if (btnClearFilter) {
        btnClearFilter.onclick = function () {
            if (selectFilterStatus) {
                selectFilterStatus.value = 'todos';
            }
            if (selectFilterSort) {
                selectFilterSort.value = 'recentes';
            }
            filterDropdown.style.display = 'none';
            let busca = inputSearch ? inputSearch.value : '';
            renderList(busca);
        };
    }
}

let modalCreate = document.getElementById('modal');
let openCreateBtn = document.getElementById('open-modal');
let closeCreateBtn = document.getElementById('close-modal');
let cancelCreateBtn = null;
let confirmCreateBtn = null;
let titleModalCreate = null;
let inputUserName = null;
let inputUserCpf = null;
let inputBookName = null;
let inputBookCod = null;

if (modalCreate) {
    cancelCreateBtn = modalCreate.querySelector('.btn-cancel');
    confirmCreateBtn = modalCreate.querySelector('.btn-check');
    titleModalCreate = modalCreate.querySelector('.title-rental-form');
    inputUserName = modalCreate.querySelector('.name-user');
    inputUserCpf = modalCreate.querySelector('.cpf-user');
    inputBookName = modalCreate.querySelector('.book-name');
    inputBookCod = modalCreate.querySelector('.book-cod');
}

function setupDataLists() {
    let userList = document.getElementById('datalist-users');
    if (!userList) {
        userList = document.createElement('datalist');
        userList.id = 'datalist-users';
        document.body.appendChild(userList);
        if (inputUserName) {
            inputUserName.setAttribute('list', 'datalist-users');
        }
    }

    let bookList = document.getElementById('datalist-books');
    if (!bookList) {
        bookList = document.createElement('datalist');
        bookList.id = 'datalist-books';
        document.body.appendChild(bookList);
        if (inputBookName) {
            inputBookName.setAttribute('list', 'datalist-books');
        }
    }

    let users = getRegisteredUsers();
    let optionsUsers = '';
    for (let i = 0; i < users.length; i++) {
        let u = users[i];
        let nome = u.nome || u.name || '';
        if (nome != '') {
            optionsUsers = optionsUsers + '<option value="' + nome + '">';
        }
    }
    userList.innerHTML = optionsUsers;

    let books = getRegisteredBooks();
    let optionsBooks = '';
    for (let i = 0; i < books.length; i++) {
        let b = books[i];
        let titulo = b.titulo || b.title || b.livro || b.nome || '';
        if (titulo != '') {
            optionsBooks = optionsBooks + '<option value="' + titulo + '">';
        }
    }
    bookList.innerHTML = optionsBooks;
}

if (inputUserName) {
    inputUserName.oninput = function () {
        let users = getRegisteredUsers();
        let digitado = inputUserName.value.trim().toLowerCase();
        if (digitado == '') return;

        for (let i = 0; i < users.length; i++) {
            let u = users[i];
            let nome = (u.nome || u.name || '').toLowerCase();
            if (nome == digitado) {
                let cpf = u.cpf || u.CPF;
                if (cpf && inputUserCpf) {
                    inputUserCpf.value = cpf;
                }
                break;
            }
        }
    };
}

if (inputUserCpf) {
    inputUserCpf.oninput = function () {
        let users = getRegisteredUsers();
        let digitado = inputUserCpf.value.split('.').join('').split('-').join('').split(' ').join('');
        if (digitado == '') return;

        for (let i = 0; i < users.length; i++) {
            let u = users[i];
            let cpfLimpo = String(u.cpf || u.CPF || '').split('.').join('').split('-').join('').split(' ').join('');
            if (cpfLimpo == digitado) {
                let nome = u.nome || u.name;
                if (nome && inputUserName) {
                    inputUserName.value = nome;
                }
                break;
            }
        }
    };
}

if (inputBookName) {
    inputBookName.oninput = function () {
        let books = getRegisteredBooks();
        let digitado = inputBookName.value.trim().toLowerCase();
        if (digitado == '') return;

        for (let i = 0; i < books.length; i++) {
            let b = books[i];
            let titulo = (b.titulo || b.title || b.livro || b.nome || '').toLowerCase();
            if (titulo == digitado) {
                let codigo = b.codigo || b.cod || b.id || '';
                if (codigo != '' && inputBookCod) {
                    inputBookCod.value = codigo;
                }
                break;
            }
        }
    };
}

if (inputBookCod) {
    inputBookCod.oninput = function () {
        let books = getRegisteredBooks();
        let digitado = inputBookCod.value.trim();
        if (digitado == '') return;

        for (let i = 0; i < books.length; i++) {
            let b = books[i];
            let codigo = String(b.codigo || b.cod || b.id || '').trim();
            if (codigo == digitado) {
                let titulo = b.titulo || b.title || b.livro || b.nome || '';
                if (titulo != '' && inputBookName) {
                    inputBookName.value = titulo;
                }
                break;
            }
        }
    };
}

function openModalForCreate() {
    setupDataLists();
    if (titleModalCreate) {
        titleModalCreate.textContent = 'Criar Aluguel';
    }
    if (inputUserName) inputUserName.value = '';
    if (inputUserCpf) inputUserCpf.value = '';
    if (inputBookName) inputBookName.value = '';
    if (inputBookCod) inputBookCod.value = '';
    if (modalCreate) modalCreate.showModal();
}

if (openCreateBtn) {
    openCreateBtn.onclick = openModalForCreate;
}

if (closeCreateBtn && modalCreate) {
    closeCreateBtn.onclick = function () {
        modalCreate.close();
    };
}

if (cancelCreateBtn && modalCreate) {
    cancelCreateBtn.onclick = function () {
        modalCreate.close();
    };
}

setupBackdropClose(modalCreate);

if (confirmCreateBtn) {
    confirmCreateBtn.onclick = function (e) {
        e.preventDefault();

        let userName = inputUserName ? inputUserName.value.trim() : '';
        let cpf = inputUserCpf ? inputUserCpf.value.trim() : '';
        let bookName = inputBookName ? inputBookName.value.trim() : '';
        let bookCod = inputBookCod ? inputBookCod.value.trim() : '';

        if (userName == '' || bookName == '') {
            alert('Por favor, informe o nome do usuário e o nome do livro.');
            return;
        }

        let rentals = getRentals();

        let dataHoje = new Date();
        let anoHoje = dataHoje.getFullYear();
        let mesHoje = String(dataHoje.getMonth() + 1).padStart(2, '0');
        let diaHoje = String(dataHoje.getDate()).padStart(2, '0');
        let today = anoHoje + '-' + mesHoje + '-' + diaHoje;

        let dataFim = new Date(dataHoje.getTime() + 14 * 24 * 60 * 60 * 1000);
        let anoFim = dataFim.getFullYear();
        let mesFim = String(dataFim.getMonth() + 1).padStart(2, '0');
        let diaFim = String(dataFim.getDate()).padStart(2, '0');
        let defaultEnd = anoFim + '-' + mesFim + '-' + diaFim;

        let newRental = {
            id: String(new Date().getTime()),
            userName: userName,
            cpf: cpf,
            bookName: bookName,
            bookCod: bookCod,
            startDate: today,
            endDate: defaultEnd,
            status: 'Ativo'
        };

        rentals.push(newRental);
        saveRentals(rentals);

        if (modalCreate) modalCreate.close();

        let busca = inputSearch ? inputSearch.value : '';
        renderList(busca);
    };
}

let modalReturn = document.getElementById('modal-return');
let closeReturnBtn = document.getElementById('close-modal-return');
let cancelReturnBtn = document.getElementById('cancel-return');
let confirmReturnBtn = document.getElementById('confirm-return');
let returnDateInput = document.getElementById('return-date');
let returnUserNameEl = document.getElementById('return-user-name');
let returnBookNameEl = document.getElementById('return-book-name');

function handleReturnAction(id) {
    let rentals = getRentals();
    let rental = null;

    for (let i = 0; i < rentals.length; i++) {
        if (rentals[i].id == id) {
            rental = rentals[i];
            break;
        }
    }

    if (!rental) return;

    if (rental.status == 'Inativo') {
        alert('Este livro já foi devolvido!');
        return;
    }

    activeTargetId = id;

    if (returnUserNameEl) returnUserNameEl.textContent = rental.userName;
    if (returnBookNameEl) returnBookNameEl.textContent = rental.bookName;

    let dataHoje = new Date();
    let ano = dataHoje.getFullYear();
    let mes = String(dataHoje.getMonth() + 1).padStart(2, '0');
    let dia = String(dataHoje.getDate()).padStart(2, '0');
    if (returnDateInput) {
        returnDateInput.value = ano + '-' + mes + '-' + dia;
    }

    if (modalReturn) modalReturn.showModal();
}

if (closeReturnBtn && modalReturn) {
    closeReturnBtn.onclick = function () {
        modalReturn.close();
    };
}

if (cancelReturnBtn && modalReturn) {
    cancelReturnBtn.onclick = function () {
        modalReturn.close();
    };
}

setupBackdropClose(modalReturn);

if (confirmReturnBtn) {
    confirmReturnBtn.onclick = function () {
        if (!activeTargetId) return;

        let rentals = getRentals();
        for (let i = 0; i < rentals.length; i++) {
            if (rentals[i].id == activeTargetId) {
                rentals[i].status = 'Inativo';
                if (returnDateInput && returnDateInput.value) {
                    rentals[i].endDate = returnDateInput.value;
                }
                break;
            }
        }

        saveRentals(rentals);
        activeTargetId = null;
        if (modalReturn) modalReturn.close();

        let busca = inputSearch ? inputSearch.value : '';
        renderList(busca);
    };
}

let modalRenew = document.getElementById('modal-renew');
let closeRenewBtn = document.getElementById('close-modal-renew');
let cancelRenewBtn = document.getElementById('cancel-renew');
let confirmRenewBtn = document.getElementById('confirm-renew');
let renewDateInput = document.getElementById('renew-date');
let renewUserNameEl = document.getElementById('renew-user-name');
let renewBookNameEl = document.getElementById('renew-book-name');

function handleRenewAction(id) {
    let rentals = getRentals();
    let rental = null;

    for (let i = 0; i < rentals.length; i++) {
        if (rentals[i].id == id) {
            rental = rentals[i];
            break;
        }
    }

    if (!rental) return;

    if (rental.status == 'Inativo') {
        alert('Não é possível renovar um livro que já foi devolvido.');
        return;
    }

    activeTargetId = id;

    if (renewUserNameEl) renewUserNameEl.textContent = rental.userName;
    if (renewBookNameEl) renewBookNameEl.textContent = rental.bookName;

    let baseDate = new Date();
    if (rental.endDate) {
        let p = rental.endDate.split('-');
        baseDate = new Date(p[0], p[1] - 1, p[2]);
    }

    baseDate.setDate(baseDate.getDate() + 7);

    let ano = baseDate.getFullYear();
    let mes = String(baseDate.getMonth() + 1).padStart(2, '0');
    let dia = String(baseDate.getDate()).padStart(2, '0');

    if (renewDateInput) {
        renewDateInput.value = ano + '-' + mes + '-' + dia;
    }

    if (modalRenew) modalRenew.showModal();
}

if (closeRenewBtn && modalRenew) {
    closeRenewBtn.onclick = function () {
        modalRenew.close();
    };
}

if (cancelRenewBtn && modalRenew) {
    cancelRenewBtn.onclick = function () {
        modalRenew.close();
    };
}

setupBackdropClose(modalRenew);

if (confirmRenewBtn) {
    confirmRenewBtn.onclick = function () {
        if (!activeTargetId) return;

        if (!renewDateInput || renewDateInput.value == '') {
            alert('Por favor, informe a nova data de devolução.');
            return;
        }

        let rentals = getRentals();
        for (let i = 0; i < rentals.length; i++) {
            if (rentals[i].id == activeTargetId) {
                rentals[i].endDate = renewDateInput.value;
                rentals[i].status = 'Ativo';
                break;
            }
        }

        saveRentals(rentals);
        activeTargetId = null;
        if (modalRenew) modalRenew.close();

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

    let linhasHr = containerList.querySelectorAll('.line-item-hr');
    for (let i = 0; i < linhasHr.length; i++) {
        linhasHr[i].remove();
    }

    let pagination = containerList.querySelector('.btn-next-page');
    let rentals = getRentals();
    let filter = '';
    if (query) {
        filter = query.trim().toLowerCase();
    }

    let selectedStatus = 'todos';
    if (selectFilterStatus) {
        selectedStatus = selectFilterStatus.value;
    }

    let selectedSort = 'recentes';
    if (selectFilterSort) {
        selectedSort = selectFilterSort.value;
    }

    let filtered = [];
    for (let i = 0; i < rentals.length; i++) {
        let item = rentals[i];
        let nomeUser = (item.userName || '').toLowerCase();
        let nomeLivro = (item.bookName || '').toLowerCase();
        let statusTexto = (item.status || '').toLowerCase();

        let matchSearch = nomeUser.indexOf(filter) != -1 || nomeLivro.indexOf(filter) != -1 || statusTexto.indexOf(filter) != -1;

        let matchStatus = true;
        if (selectedStatus == 'Ativo') {
            matchStatus = item.status == 'Ativo';
        } else if (selectedStatus == 'Inativo') {
            matchStatus = item.status == 'Inativo';
        } else if (selectedStatus == 'Atrasado') {
            matchStatus = isAtrasado(item);
        }

        if (matchSearch && matchStatus) {
            filtered.push(item);
        }
    }

    for (let i = 0; i < filtered.length; i++) {
        for (let j = i + 1; j < filtered.length; j++) {
            let deveTrocar = false;

            if (selectedSort == 'nome') {
                let nomeA = (filtered[i].userName || '').toLowerCase();
                let nomeB = (filtered[j].userName || '').toLowerCase();
                if (nomeA > nomeB) {
                    deveTrocar = true;
                }
            } else if (selectedSort == 'vencimento') {
                let dataA = filtered[i].endDate || '';
                let dataB = filtered[j].endDate || '';
                if (dataA > dataB) {
                    deveTrocar = true;
                }
            } else {
                let idA = Number(filtered[i].id) || 0;
                let idB = Number(filtered[j].id) || 0;
                if (idA < idB) {
                    deveTrocar = true;
                }
            }

            if (deveTrocar) {
                let temp = filtered[i];
                filtered[i] = filtered[j];
                filtered[j] = temp;
            }
        }
    }

    for (let i = 0; i < filtered.length; i++) {
        let rental = filtered[i];
        let isAtivo = rental.status == 'Ativo';
        let atrasado = isAtrasado(rental);

        let displayStatus = rental.status;
        let statusColor = '#e74c3c';
        if (isAtivo) {
            statusColor = '#2ecc71';
        }

        if (atrasado) {
            displayStatus = 'Atrasado';
            statusColor = '#e67e22';
        }

        let row = document.createElement('div');
        row.className = 'container-table';
        row.innerHTML =
            '<p class="name-p">' + rental.userName + '</p>' +
            '<p class="book-p">' + rental.bookName + '</p>' +
            '<p class="date-start-p">' + formatDateBR(rental.startDate) + '</p>' +
            '<p class="date-end-p">' + formatDateBR(rental.endDate) + '</p>' +
            '<p class="status-p" style="color: ' + statusColor + '; font-weight: bold;">' + displayStatus + '</p>' +
            '<div class="container-btns">' +
            '<button class="btn-return">Devolver</button>' +
            '<button class="btn-renew">Renovar</button>' +
            '</div>';

        let btnReturn = row.querySelector('.btn-return');
        btnReturn.onclick = function () {
            handleReturnAction(rental.id);
        };

        let btnRenew = row.querySelector('.btn-renew');
        btnRenew.onclick = function () {
            handleRenewAction(rental.id);
        };

        let hr = document.createElement('hr');
        hr.className = 'line-item-hr';

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

setupDataLists();
setupFilterUI();
renderList('');