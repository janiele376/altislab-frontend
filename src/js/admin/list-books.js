const STORAGE_KEY_BOOKS = '@biblioteca:livros';
const STORAGE_KEY_PUBLISHERS = '@biblioteca:editoras';

const containerList = document.querySelector('.container-list');
const inputSearch = document.querySelector('.input-search');

const modalCreate = document.getElementById('modal-create');
const openCreateBtn = document.getElementById('open-modal-create');
const closeCreateBtn = document.getElementById('close-modal-create');
const cancelCreateBtn = document.getElementById('cancel-create');
const confirmCreateBtn = modalCreate?.querySelector('.btn-check');

const titleModalCreate = modalCreate?.querySelector('.title-rental-form');
const inputBookName = modalCreate?.querySelector('.book-name');
const inputBookCod = modalCreate?.querySelector('.book-cod');
const inputBookPublisher = modalCreate?.querySelector('.book-publisher');
const inputBookDate = modalCreate?.querySelector('.book-date');
const inputBookQuantity = modalCreate?.querySelector('.book-quantity');

const modalDelete = document.getElementById('modal-delete');
const closeDeleteBtn = document.getElementById('close-modal-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const deleteBookCod = document.getElementById('delete-book-cod');
const deleteBookName = document.getElementById('delete-book-name');

let editandoCod = null;

function fecharNoBackdrop(dialog) {
  if (!dialog) return;
  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const estaDentro = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!estaDentro) {
      dialog.close();
    }
  });
}

fecharNoBackdrop(modalCreate);
fecharNoBackdrop(modalDelete);

function getBooks() {
  const data = localStorage.getItem(STORAGE_KEY_BOOKS);
  return data ? JSON.parse(data) : [];
}

function saveBooks(data) {
  localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(data));
}

function getPublishers() {
  const data = localStorage.getItem(STORAGE_KEY_PUBLISHERS);
  return data ? JSON.parse(data) : [];
}

// Preenche o campo de editoras (compatível com <select> ou <datalist>)
function popularEditoras(valorSelecionado = '') {
  if (!inputBookPublisher) return;

  const publishers = getPublishers();
  const tag = inputBookPublisher.tagName.toLowerCase();

  if (tag === 'select') {
    inputBookPublisher.innerHTML = '<option value="" disabled selected>Selecione uma editora</option>';

    publishers.forEach((p) => {
      const nome = p.nome || p.name || p.razaoSocial || '';
      if (!nome) return;

      const option = document.createElement('option');
      option.value = nome;
      option.textContent = nome;

      if (nome === valorSelecionado) {
        option.selected = true;
      }

      inputBookPublisher.appendChild(option);
    });
  } else {
    // Caso ainda esteja usando <input> com <datalist>
    let datalist = document.getElementById('datalist-publishers');
    if (!datalist) {
      datalist = document.createElement('datalist');
      datalist.id = 'datalist-publishers';
      document.body.appendChild(datalist);
    }
    inputBookPublisher.setAttribute('list', 'datalist-publishers');

    datalist.innerHTML = publishers
      .map((p) => `<option value="${p.nome || p.name || p.razaoSocial || ''}">`)
      .join('');

    inputBookPublisher.value = valorSelecionado;
  }
}

function formatDateBR(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

openCreateBtn?.addEventListener('click', () => {
  editandoCod = null;
  popularEditoras();

  if (titleModalCreate) titleModalCreate.textContent = 'Criar Livro';
  if (inputBookName) inputBookName.value = '';
  if (inputBookCod) {
    inputBookCod.value = '';
    inputBookCod.disabled = false;
  }
  if (inputBookPublisher) inputBookPublisher.value = '';
  if (inputBookDate) inputBookDate.value = '';
  if (inputBookQuantity) inputBookQuantity.value = '1';

  modalCreate.showModal();
});

[closeCreateBtn, cancelCreateBtn].forEach((btn) => {
  btn?.addEventListener('click', () => modalCreate.close());
});

function abrirModalEditar(cod, nome, editora, data, quantidade) {
  editandoCod = String(cod);
  popularEditoras(editora);

  if (titleModalCreate) titleModalCreate.textContent = 'Editar Livro';
  if (inputBookName) inputBookName.value = nome || '';
  if (inputBookCod) {
    inputBookCod.value = cod || '';
    inputBookCod.disabled = true;
  }
  if (inputBookPublisher) inputBookPublisher.value = editora || '';
  if (inputBookDate) inputBookDate.value = data || '';
  if (inputBookQuantity) inputBookQuantity.value = quantidade ?? 1;

  modalCreate.showModal();
}

function abrirModalExcluir(cod, nome) {
  if (deleteBookCod && deleteBookName) {
    deleteBookCod.textContent = cod;
    deleteBookName.textContent = nome;
  }
  modalDelete.showModal();
}

[closeDeleteBtn, cancelDeleteBtn].forEach((btn) => {
  btn?.addEventListener('click', () => modalDelete.close());
});

confirmCreateBtn?.addEventListener('click', (e) => {
  e.preventDefault();

  const titulo = inputBookName?.value.trim();
  const cod = inputBookCod?.value.trim();
  const editora = inputBookPublisher?.value.trim();
  const lancamento = inputBookDate?.value;
  const quantidade = Math.max(0, parseInt(inputBookQuantity?.value, 10) || 0);

  if (!titulo || !cod || !editora) {
    alert('Por favor, informe ao menos o Nome, Código e a Editora do livro.');
    return;
  }

  let books = getBooks();

  if (editandoCod) {
    books = books.map((b) => {
      const bCod = String(b.codigo || b.cod || b.id || '');
      if (bCod === editandoCod) {
        return { ...b, titulo, editora, lancamento, quantidade };
      }
      return b;
    });
  } else {
    const existe = books.some((b) => String(b.codigo || b.cod || b.id || '') === cod);
    if (existe) {
      alert('Já existe um livro cadastrado com este código!');
      return;
    }

    books.push({
      id: String(Date.now()),
      codigo: cod,
      titulo,
      editora,
      lancamento,
      quantidade
    });
  }

  saveBooks(books);
  modalCreate.close();
  renderList(inputSearch?.value || '');
});

confirmDeleteBtn?.addEventListener('click', () => {
  const cod = deleteBookCod?.textContent;
  if (!cod) return;

  let books = getBooks();
  books = books.filter((b) => String(b.codigo || b.cod || b.id || '') !== cod);
  saveBooks(books);

  modalDelete.close();
  renderList(inputSearch?.value || '');
});

function renderList(query = '') {
  if (!containerList) return;

  containerList.querySelectorAll('.container-table').forEach((el) => el.remove());
  containerList.querySelectorAll('hr:not(.line-search):not(.line-header-divider)').forEach((el) => el.remove());

  const pagination = containerList.querySelector('.btn-next-page');
  const books = getBooks();
  const filter = query.trim().toLowerCase();

  const filtered = books.filter((b) => {
    const titulo = (b.titulo || b.title || b.livro || b.nome || '').toLowerCase();
    const cod = String(b.codigo || b.cod || b.id || '').toLowerCase();
    const editora = (b.editora || b.publisher || '').toLowerCase();
    return titulo.includes(filter) || cod.includes(filter) || editora.includes(filter);
  });

  filtered.forEach((book) => {
    const cod = book.codigo || book.cod || book.id || '-';
    const titulo = book.titulo || book.title || book.livro || book.nome || '-';
    const editora = book.editora || book.publisher || '-';
    const lancamento = book.lancamento || book.dataLancamento || '';
    const quantidade = book.quantidade !== undefined ? book.quantidade : (book.qtd !== undefined ? book.qtd : 1);

    const row = document.createElement('div');
    row.className = 'container-table';
    row.innerHTML = `
      <p class="cod-p">${cod}</p>
      <p class="book-p">${titulo}</p>
      <p class="publisher-p">${editora}</p>
      <p class="date-release-p">${formatDateBR(lancamento)}</p>
      <p class="quantity-p" style="font-weight: bold;">${quantidade}</p>
      <div class="container-btns">
        <button class="btn-edit">Editar</button>
        <button class="btn-delete">Excluir</button>
      </div>
    `;

    row.querySelector('.btn-edit').addEventListener('click', () => {
      abrirModalEditar(cod, titulo, editora, lancamento, quantidade);
    });

    row.querySelector('.btn-delete').addEventListener('click', () => {
      abrirModalExcluir(cod, titulo);
    });

    const hr = document.createElement('hr');
    hr.className = 'book-separator-hr';

    if (pagination) {
      containerList.insertBefore(row, pagination);
      containerList.insertBefore(hr, pagination);
    } else {
      containerList.appendChild(row);
      containerList.appendChild(hr);
    }
  });
}

inputSearch?.addEventListener('input', (e) => {
  renderList(e.target.value);
});

renderList();