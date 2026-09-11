let STORAGE_KEY_PUBLISHERS = '@biblioteca:editoras';

let containerList = document.querySelector('.container-list');
let inputSearch = document.querySelector('.input-search');

let modalCreate = document.getElementById('modal-create');
let openCreateBtn = document.getElementById('open-modal-create');
let closeCreateBtn = document.getElementById('close-modal-create');
let cancelCreateBtn = document.getElementById('cancel-create');
let confirmCreateBtn = null;

if (modalCreate) {
    confirmCreateBtn = modalCreate.querySelector('.btn-check');
}

let titleModalCreate = null;
let inputPublisherName = null;
let inputPublisherCnpj = null;
let inputPublisherEmail = null;
let inputPublisherPhone = null;
let inputPublisherAddress = null;

if (modalCreate) {
    titleModalCreate = modalCreate.querySelector('.title-rental-form');
    inputPublisherName = modalCreate.querySelector('.publisher-name');
    inputPublisherCnpj = modalCreate.querySelector('.publisher-cnpj');
    inputPublisherEmail = modalCreate.querySelector('.publisher-email');
    inputPublisherPhone = modalCreate.querySelector('.publisher-phone');
    inputPublisherAddress = modalCreate.querySelector('.publisher-address');
}

let modalDelete = document.getElementById('modal-delete');
let closeDeleteBtn = document.getElementById('close-modal-delete');
let cancelDeleteBtn = document.getElementById('cancel-delete');
let confirmDeleteBtn = document.getElementById('confirm-delete');
let deletePublisherId = document.getElementById('delete-publisher-id');
let deletePublisherName = document.getElementById('delete-publisher-name');

let editandoId = null;

function fecharNoBackdrop(dialog) {
    if (!dialog) return;
    dialog.onclick = function (e) {
        let rect = dialog.getBoundingClientRect();
        let clicouDentro = true;

        if (e.clientY < rect.top || e.clientY > rect.top + rect.height || e.clientX < rect.left || e.clientX > rect.left + rect.width) {
            clicouDentro = false;
        }

        if (clicouDentro == false) {
            dialog.close();
        }
    };
}

fecharNoBackdrop(modalCreate);
fecharNoBackdrop(modalDelete);

function getPublishers() {
    let data = localStorage.getItem(STORAGE_KEY_PUBLISHERS);
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

function savePublishers(data) {
    let textoJson = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY_PUBLISHERS, textoJson);
}

if (openCreateBtn) {
    openCreateBtn.onclick = function () {
        editandoId = null;
        if (titleModalCreate) {
            titleModalCreate.textContent = 'Criar Editora';
        }
        if (inputPublisherName) {
            inputPublisherName.value = '';
        }
        if (inputPublisherCnpj) {
            inputPublisherCnpj.value = '';
        }
        if (inputPublisherEmail) {
            inputPublisherEmail.value = '';
        }
        if (inputPublisherPhone) {
            inputPublisherPhone.value = '';
        }
        if (inputPublisherAddress) {
            inputPublisherAddress.value = '';
        }
        modalCreate.showModal();
    };
}

if (closeCreateBtn) {
    closeCreateBtn.onclick = function () {
        modalCreate.close();
    };
}

if (cancelCreateBtn) {
    cancelCreateBtn.onclick = function () {
        modalCreate.close();
    };
}

function abrirModalEditar(id, nome, cnpj, email, telefone, endereco) {
    editandoId = String(id);
    if (titleModalCreate) {
        titleModalCreate.textContent = 'Editar Editora';
    }
    if (inputPublisherName) {
        inputPublisherName.value = nome || '';
    }
    if (inputPublisherCnpj) {
        inputPublisherCnpj.value = cnpj || '';
    }
    if (inputPublisherEmail) {
        inputPublisherEmail.value = email || '';
    }
    if (inputPublisherPhone) {
        inputPublisherPhone.value = telefone || '';
    }
    if (inputPublisherAddress) {
        inputPublisherAddress.value = endereco || '';
    }
    modalCreate.showModal();
}

function abrirModalExcluir(id, nome) {
    if (deletePublisherId && deletePublisherName) {
        deletePublisherId.textContent = id;
        deletePublisherName.textContent = nome;
    }
    modalDelete.showModal();
}

if (closeDeleteBtn) {
    closeDeleteBtn.onclick = function () {
        modalDelete.close();
    };
}

if (cancelDeleteBtn) {
    cancelDeleteBtn.onclick = function () {
        modalDelete.close();
    };
}

if (confirmCreateBtn) {
    confirmCreateBtn.onclick = function (e) {
        e.preventDefault();

        let nome = inputPublisherName ? inputPublisherName.value.trim() : '';
        let cnpj = inputPublisherCnpj ? inputPublisherCnpj.value.trim() : '';
        let email = inputPublisherEmail ? inputPublisherEmail.value.trim() : '';
        let telefone = inputPublisherPhone ? inputPublisherPhone.value.trim() : '';
        let endereco = inputPublisherAddress ? inputPublisherAddress.value.trim() : '';

        if (nome == '') {
            alert('Por favor, informe o Nome da editora.');
            return;
        }

        let publishers = getPublishers();

        if (editandoId != null) {
            for (let i = 0; i < publishers.length; i++) {
                let p = publishers[i];
                if (String(p.id) == editandoId) {
                    p.nome = nome;
                    p.cnpj = cnpj;
                    p.email = email;
                    p.telefone = telefone;
                    p.endereco = endereco;
                    break;
                }
            }
        } else {
            let maiorId = 0;
            for (let i = 0; i < publishers.length; i++) {
                let numId = Number(publishers[i].id);
                if (!isNaN(numId) && numId > maiorId) {
                    maiorId = numId;
                }
            }

            let nextId = '1';
            if (publishers.length > 0) {
                nextId = String(maiorId + 1);
            }

            let novaEditora = {
                id: nextId,
                nome: nome,
                cnpj: cnpj,
                email: email,
                telefone: telefone,
                endereco: endereco
            };

            publishers.push(novaEditora);
        }

        savePublishers(publishers);
        modalCreate.close();

        let textoBusca = inputSearch ? inputSearch.value : '';
        renderList(textoBusca);
    };
}

if (confirmDeleteBtn) {
    confirmDeleteBtn.onclick = function () {
        let id = deletePublisherId ? deletePublisherId.textContent : '';
        if (id == '') return;

        let publishers = getPublishers();
        let novaLista = [];

        for (let i = 0; i < publishers.length; i++) {
            let p = publishers[i];
            if (String(p.id) != id) {
                novaLista.push(p);
            }
        }

        savePublishers(novaLista);
        modalDelete.close();

        let textoBusca = inputSearch ? inputSearch.value : '';
        renderList(textoBusca);
    };
}

function renderList(query) {
    if (!containerList) return;

    let tabelas = containerList.querySelectorAll('.container-table');
    for (let i = 0; i < tabelas.length; i++) {
        tabelas[i].remove();
    }

    let linhasHr = containerList.querySelectorAll('hr');
    for (let i = 0; i < linhasHr.length; i++) {
        let hr = linhasHr[i];
        let ehBusca = hr.classList.contains('line-search');
        let ehCabecalho = hr.classList.contains('line-header-divider');
        if (!ehBusca && !ehCabecalho) {
            hr.remove();
        }
    }

    let pagination = containerList.querySelector('.btn-next-page');
    let publishers = getPublishers();
    let filter = '';
    if (query) {
        filter = query.trim().toLowerCase();
    }

    let filtered = [];
    for (let i = 0; i < publishers.length; i++) {
        let p = publishers[i];
        let nome = (p.nome || p.name || '').toLowerCase();
        let cnpj = (p.cnpj || '').toLowerCase();
        let email = (p.email || '').toLowerCase();
        let endereco = (p.endereco || p.cidade || '').toLowerCase();

        let achouNome = nome.indexOf(filter) != -1;
        let achouCnpj = cnpj.indexOf(filter) != -1;
        let achouEmail = email.indexOf(filter) != -1;
        let achouEndereco = endereco.indexOf(filter) != -1;

        if (achouNome || achouCnpj || achouEmail || achouEndereco) {
            filtered.push(p);
        }
    }

    for (let i = 0; i < filtered.length; i++) {
        let pub = filtered[i];
        let id = pub.id || '-';
        let nome = pub.nome || pub.name || '-';
        let cnpj = pub.cnpj || '';
        let email = pub.email || '';
        let telefone = pub.telefone || pub.phone || '';

        let contato = '';
        if (email != '' && telefone != '') {
            contato = email + ' | ' + telefone;
        } else if (email != '') {
            contato = email;
        } else if (telefone != '') {
            contato = telefone;
        } else {
            contato = '-';
        }

        let endereco = pub.endereco || pub.cidade || '-';

        let row = document.createElement('div');
        row.className = 'container-table';
        row.innerHTML =
            '<p class="id-p">' + id + '</p>' +
            '<p class="name-p">' + nome + '</p>' +
            '<p class="contact-p">' + contato + '</p>' +
            '<p class="address-p">' + endereco + '</p>' +
            '<div class="container-btns">' +
            '<button class="btn-edit">Editar</button>' +
            '<button class="btn-delete">Excluir</button>' +
            '</div>';

        let btnEdit = row.querySelector('.btn-edit');
        btnEdit.onclick = function () {
            abrirModalEditar(id, nome, cnpj, email, telefone, endereco);
        };

        let btnDelete = row.querySelector('.btn-delete');
        btnDelete.onclick = function () {
            abrirModalExcluir(id, nome);
        };

        let hr = document.createElement('hr');
        hr.className = 'publisher-separator-hr';

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