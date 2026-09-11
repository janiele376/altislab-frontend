let STORAGE_KEY_BOOKS = '@biblioteca:livros';
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
let inputBookName = null;
let inputBookCod = null;
let inputBookPublisher = null;
let inputBookDate = null;
let inputBookQuantity = null;

if (modalCreate) {
    titleModalCreate = modalCreate.querySelector('.title-rental-form');
    inputBookName = modalCreate.querySelector('.book-name');
    inputBookCod = modalCreate.querySelector('.book-cod');
    inputBookPublisher = modalCreate.querySelector('.book-publisher');
    inputBookDate = modalCreate.querySelector('.book-date');
    inputBookQuantity = modalCreate.querySelector('.book-quantity');
}

let modalDelete = document.getElementById('modal-delete');
let closeDeleteBtn = document.getElementById('close-modal-delete');
let cancelDeleteBtn = document.getElementById('cancel-delete');
let confirmDeleteBtn = document.getElementById('confirm-delete');
let deleteBookCod = document.getElementById('delete-book-cod');
let deleteBookName = document.getElementById('delete-book-name');

let editandoCod = null;

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

function getBooks() {
    let data = localStorage.getItem(STORAGE_KEY_BOOKS);
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

function saveBooks(data) {
    let textoJson = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY_BOOKS, textoJson);
}

function getPublishers() {
    let data = localStorage.getItem(STORAGE_KEY_PUBLISHERS);
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

function popularEditoras(valorSelecionado) {
    if (!inputBookPublisher) return;

    let publishers = getPublishers();
    let tag = inputBookPublisher.tagName.toLowerCase();

    if (tag == 'select') {
        inputBookPublisher.innerHTML = '<option value="" disabled selected>Selecione uma editora</option>';

        for (let i = 0; i < publishers.length; i++) {
            let p = publishers[i];
            let nome = p.nome || p.name || p.razaoSocial || '';

            if (nome != '') {
                let option = document.createElement('option');
                option.value = nome;
                option.textContent = nome;

                if (valorSelecionado && nome == valorSelecionado) {
                    option.selected = true;
                }

                inputBookPublisher.appendChild(option);
            }
        }
    } else {
        let datalist = document.getElementById('datalist-publishers');
        if (!datalist) {
            datalist = document.createElement('datalist');
            datalist.id = 'datalist-publishers';
            document.body.appendChild(datalist);
        }
        inputBookPublisher.setAttribute('list', 'datalist-publishers');

        let htmlOptions = '';
        for (let i = 0; i < publishers.length; i++) {
            let p = publishers[i];
            let nome = p.nome || p.name || p.razaoSocial || '';
            htmlOptions = htmlOptions + '<option value="' + nome + '">';
        }

        datalist.innerHTML = htmlOptions;
        inputBookPublisher.value = valorSelecionado ? valorSelecionado : '';
    }
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

if (openCreateBtn) {
    openCreateBtn.onclick = function () {
        editandoCod = null;
        popularEditoras('');

        if (titleModalCreate) {
            titleModalCreate.textContent = 'Criar Livro';
        }
        if (inputBookName) {
            inputBookName.value = '';
        }
        if (inputBookCod) {
            inputBookCod.value = '';
            inputBookCod.disabled = false;
        }
        if (inputBookPublisher) {
            inputBookPublisher.value = '';
        }
        if (inputBookDate) {
            inputBookDate.value = '';
        }
        if (inputBookQuantity) {
            inputBookQuantity.value = '1';
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

function abrirModalEditar(cod, nome, editora, data, quantidade) {
    editandoCod = String(cod);
    popularEditoras(editora);

    if (titleModalCreate) {
        titleModalCreate.textContent = 'Editar Livro';
    }
    if (inputBookName) {
        inputBookName.value = nome || '';
    }
    if (inputBookCod) {
        inputBookCod.value = cod || '';
        inputBookCod.disabled = true;
    }
    if (inputBookPublisher) {
        inputBookPublisher.value = editora || '';
    }
    if (inputBookDate) {
        inputBookDate.value = data || '';
    }
    if (inputBookQuantity) {
        if (quantidade != undefined && quantidade != null) {
            inputBookQuantity.value = quantidade;
        } else {
            inputBookQuantity.value = 1;
        }
    }

    modalCreate.showModal();
}

function abrirModalExcluir(cod, nome) {
    if (deleteBookCod && deleteBookName) {
        deleteBookCod.textContent = cod;
        deleteBookName.textContent = nome;
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

        let titulo = inputBookName ? inputBookName.value.trim() : '';
        let cod = inputBookCod ? inputBookCod.value.trim() : '';
        let editora = inputBookPublisher ? inputBookPublisher.value.trim() : '';
        let lancamento = inputBookDate ? inputBookDate.value : '';
        let quantidadeTexto = inputBookQuantity ? inputBookQuantity.value : '0';
        let quantidade = parseInt(quantidadeTexto);

        if (isNaN(quantidade) || quantidade < 0) {
            quantidade = 0;
        }

        if (titulo == '' || cod == '' || editora == '') {
            alert('Por favor, informe ao menos o Nome, Código e a Editora do livro.');
            return;
        }

        let books = getBooks();

        if (editandoCod != null) {
            for (let i = 0; i < books.length; i++) {
                let b = books[i];
                let bCod = String(b.codigo || b.cod || b.id || '');
                if (bCod == editandoCod) {
                    b.titulo = titulo;
                    b.editora = editora;
                    b.lancamento = lancamento;
                    b.quantidade = quantidade;
                    break;
                }
            }
        } else {
            let existe = false;
            for (let i = 0; i < books.length; i++) {
                let b = books[i];
                let bCod = String(b.codigo || b.cod || b.id || '');
                if (bCod == cod) {
                    existe = true;
                    break;
                }
            }

            if (existe) {
                alert('Já existe um livro cadastrado com este código!');
                return;
            }

            let novoLivro = {
                id: String(new Date().getTime()),
                codigo: cod,
                titulo: titulo,
                editora: editora,
                lancamento: lancamento,
                quantidade: quantidade
            };

            books.push(novoLivro);
        }

        saveBooks(books);
        modalCreate.close();

        let textoBusca = inputSearch ? inputSearch.value : '';
        renderList(textoBusca);
    };
}

if (confirmDeleteBtn) {
    confirmDeleteBtn.onclick = function () {
        let cod = deleteBookCod ? deleteBookCod.textContent : '';
        if (cod == '') return;

        let books = getBooks();
        let novaLista = [];

        for (let i = 0; i < books.length; i++) {
            let b = books[i];
            let bCod = String(b.codigo || b.cod || b.id || '');
            if (bCod != cod) {
                novaLista.push(b);
            }
        }

        saveBooks(novaLista);
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
    let books = getBooks();
    let filter = '';
    if (query) {
        filter = query.trim().toLowerCase();
    }

    let filtered = [];
    for (let i = 0; i < books.length; i++) {
        let b = books[i];
        let titulo = (b.titulo || b.title || b.livro || b.nome || '').toLowerCase();
        let cod = String(b.codigo || b.cod || b.id || '').toLowerCase();
        let editora = (b.editora || b.publisher || '').toLowerCase();

        let achouTitulo = titulo.indexOf(filter) != -1;
        let achouCod = cod.indexOf(filter) != -1;
        let achouEditora = editora.indexOf(filter) != -1;

        if (achouTitulo || achouCod || achouEditora) {
            filtered.push(b);
        }
    }

    for (let i = 0; i < filtered.length; i++) {
        let book = filtered[i];
        let cod = book.codigo || book.cod || book.id || '-';
        let titulo = book.titulo || book.title || book.livro || book.nome || '-';
        let editora = book.editora || book.publisher || '-';
        let lancamento = book.lancamento || book.dataLancamento || '';
        let quantidade = 1;

        if (book.quantidade != undefined) {
            quantidade = book.quantidade;
        } else if (book.qtd != undefined) {
            quantidade = book.qtd;
        }

        let row = document.createElement('div');
        row.className = 'container-table';
        row.innerHTML =
            '<p class="cod-p">' + cod + '</p>' +
            '<p class="book-p">' + titulo + '</p>' +
            '<p class="publisher-p">' + editora + '</p>' +
            '<p class="date-release-p">' + formatDateBR(lancamento) + '</p>' +
            '<p class="quantity-p" style="font-weight: bold;">' + quantidade + '</p>' +
            '<div class="container-btns">' +
            '<button class="btn-edit">Editar</button>' +
            '<button class="btn-delete">Excluir</button>' +
            '</div>';

        let btnEdit = row.querySelector('.btn-edit');
        btnEdit.onclick = function () {
            abrirModalEditar(cod, titulo, editora, lancamento, quantidade);
        };

        let btnDelete = row.querySelector('.btn-delete');
        btnDelete.onclick = function () {
            abrirModalExcluir(cod, titulo);
        };

        let hr = document.createElement('hr');
        hr.className = 'book-separator-hr';

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