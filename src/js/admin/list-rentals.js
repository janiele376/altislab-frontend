function setupBackdropClose(dialogElement) {
  dialogElement.addEventListener('click', (e) => {
    const rect = dialogElement.getBoundingClientRect();
    const clickedInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!clickedInDialog) {
      dialogElement.close();
    }
  });
}

function getStoredArray(possibleKeys) {
  for (const key of possibleKeys) {
    const data = localStorage.getItem(key);
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error(`Erro ao processar chave ${key}:`, e);
      }
    }
  }
  return [];
}

function getRegisteredUsers() {
  return getStoredArray(['@biblioteca:usuarios', 'usuarios', 'users']);
}

function getRegisteredBooks() {
  return getStoredArray(['@biblioteca:livros', 'livros', 'books']);
}

function getRentals() {
  return getStoredArray(['@biblioteca:alugueis', 'alugueis', 'rentals']);
}

function saveRentals(data) {
  localStorage.setItem('@biblioteca:alugueis', JSON.stringify(data));
}

function formatDateBR(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function isAtrasado(rental) {
  if (rental.status === 'Inativo') return false;
  if (!rental.endDate) return false;
  const hoje = new Date().toISOString().split('T')[0];
  return rental.endDate < hoje;
}

const containerList = document.querySelector('.container-list');
const inputSearch = document.querySelector('.input-search');
let activeTargetId = null;

const filterIcon = document.getElementById('btn-filter');
const filterDropdown = document.getElementById('filter-dropdown');
const selectFilterStatus = document.getElementById('filter-status');
const selectFilterSort = document.getElementById('filter-sort');
const btnApplyFilter = document.getElementById('btn-apply-filter');
const btnClearFilter = document.getElementById('btn-clear-filter');

function setupFilterUI() {
  if (!filterIcon || !filterDropdown) return;

  filterIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    const isHidden = filterDropdown.style.display === 'none' || !filterDropdown.style.display;
    filterDropdown.style.display = isHidden ? 'flex' : 'none';
  });

  document.addEventListener('click', (e) => {
    if (filterDropdown && !filterDropdown.contains(e.target) && e.target !== filterIcon) {
      filterDropdown.style.display = 'none';
    }
  });

  btnApplyFilter?.addEventListener('click', () => {
    filterDropdown.style.display = 'none';
    renderList(inputSearch?.value || '');
  });

  btnClearFilter?.addEventListener('click', () => {
    if (selectFilterStatus) selectFilterStatus.value = 'todos';
    if (selectFilterSort) selectFilterSort.value = 'recentes';
    filterDropdown.style.display = 'none';
    renderList(inputSearch?.value || '');
  });
}

const modalCreate = document.getElementById('modal');
const openCreateBtn = document.getElementById('open-modal');
const closeCreateBtn = document.getElementById('close-modal');
const cancelCreateBtn = modalCreate.querySelector('.btn-cancel');
const confirmCreateBtn = modalCreate.querySelector('.btn-check');

const titleModalCreate = modalCreate.querySelector('.title-rental-form');
const inputUserName = modalCreate.querySelector('.name-user');
const inputUserCpf = modalCreate.querySelector('.cpf-user');
const inputBookName = modalCreate.querySelector('.book-name');
const inputBookCod = modalCreate.querySelector('.book-cod');

function setupDataLists() {
  let userList = document.getElementById('datalist-users');
  if (!userList) {
    userList = document.createElement('datalist');
    userList.id = 'datalist-users';
    document.body.appendChild(userList);
    inputUserName.setAttribute('list', 'datalist-users');
  }

  let bookList = document.getElementById('datalist-books');
  if (!bookList) {
    bookList = document.createElement('datalist');
    bookList.id = 'datalist-books';
    document.body.appendChild(bookList);
    inputBookName.setAttribute('list', 'datalist-books');
  }

  const users = getRegisteredUsers();
  userList.innerHTML = users
    .map((u) => {
      const nome = u.nome || u.name || '';
      return nome ? `<option value="${nome}">` : '';
    })
    .join('');

  const books = getRegisteredBooks();
  bookList.innerHTML = books
    .map((b) => {
      const titulo = b.titulo || b.title || b.livro || b.nome || '';
      return titulo ? `<option value="${titulo}">` : '';
    })
    .join('');
}

inputUserName.addEventListener('input', () => {
  const users = getRegisteredUsers();
  const digitado = inputUserName.value.trim().toLowerCase();
  if (!digitado) return;

  const found = users.find((u) => (u.nome || u.name || '').toLowerCase() === digitado);
  if (found && (found.cpf || found.CPF)) {
    inputUserCpf.value = found.cpf || found.CPF;
  }
});

inputUserCpf.addEventListener('input', () => {
  const users = getRegisteredUsers();
  const digitado = inputUserCpf.value.replace(/\D/g, '');
  if (!digitado) return;

  const found = users.find((u) => String(u.cpf || u.CPF || '').replace(/\D/g, '') === digitado);
  if (found && (found.nome || found.name)) {
    inputUserName.value = found.nome || found.name;
  }
});

inputBookName.addEventListener('input', () => {
  const books = getRegisteredBooks();
  const digitado = inputBookName.value.trim().toLowerCase();
  if (!digitado) return;

  const found = books.find((b) => (b.titulo || b.title || b.livro || b.nome || '').toLowerCase() === digitado);
  if (found) {
    const codigo = found.codigo || found.cod || found.id || '';
    if (codigo) inputBookCod.value = codigo;
  }
});

inputBookCod.addEventListener('input', () => {
  const books = getRegisteredBooks();
  const digitado = inputBookCod.value.trim();
  if (!digitado) return;

  const found = books.find((b) => String(b.codigo || b.cod || b.id || '').trim() === digitado);
  if (found) {
    const titulo = found.titulo || found.title || found.livro || found.nome || '';
    if (titulo) inputBookName.value = titulo;
  }
});

function openModalForCreate() {
  setupDataLists();
  if (titleModalCreate) titleModalCreate.textContent = 'Criar Aluguel';
  inputUserName.value = '';
  inputUserCpf.value = '';
  inputBookName.value = '';
  inputBookCod.value = '';
  modalCreate.showModal();
}

openCreateBtn?.addEventListener('click', openModalForCreate);
closeCreateBtn?.addEventListener('click', () => modalCreate.close());
cancelCreateBtn?.addEventListener('click', () => modalCreate.close());
setupBackdropClose(modalCreate);

confirmCreateBtn?.addEventListener('click', (e) => {
  e.preventDefault();

  const userName = inputUserName.value.trim();
  const cpf = inputUserCpf.value.trim();
  const bookName = inputBookName.value.trim();
  const bookCod = inputBookCod.value.trim();

  if (!userName || !bookName) {
    alert('Por favor, informe o nome do usuário e o nome do livro.');
    return;
  }

  const rentals = getRentals();
  const today = new Date().toISOString().split('T')[0];
  const defaultEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const newRental = {
    id: String(Date.now()),
    userName,
    cpf,
    bookName,
    bookCod,
    startDate: today,
    endDate: defaultEnd,
    status: 'Ativo'
  };

  rentals.push(newRental);
  saveRentals(rentals);
  modalCreate.close();
  renderList(inputSearch?.value || '');
});

const modalReturn = document.getElementById('modal-return');
const closeReturnBtn = document.getElementById('close-modal-return');
const cancelReturnBtn = document.getElementById('cancel-return');
const confirmReturnBtn = document.getElementById('confirm-return');
const returnDateInput = document.getElementById('return-date');
const returnUserNameEl = document.getElementById('return-user-name');
const returnBookNameEl = document.getElementById('return-book-name');

function handleReturnAction(id) {
  const rentals = getRentals();
  const rental = rentals.find((item) => item.id === id);
  if (!rental) return;

  if (rental.status === 'Inativo') {
    alert('Este livro já foi devolvido!');
    return;
  }

  activeTargetId = id;

  if (returnUserNameEl) returnUserNameEl.textContent = rental.userName;
  if (returnBookNameEl) returnBookNameEl.textContent = rental.bookName;
  if (returnDateInput) returnDateInput.value = new Date().toISOString().split('T')[0];

  modalReturn.showModal();
}

closeReturnBtn?.addEventListener('click', () => modalReturn.close());
cancelReturnBtn?.addEventListener('click', () => modalReturn.close());
setupBackdropClose(modalReturn);

confirmReturnBtn?.addEventListener('click', () => {
  if (!activeTargetId) return;

  let rentals = getRentals();
  rentals = rentals.map((item) => {
    if (item.id === activeTargetId) {
      return {
        ...item,
        status: 'Inativo',
        endDate: returnDateInput && returnDateInput.value ? returnDateInput.value : item.endDate
      };
    }
    return item;
  });

  saveRentals(rentals);
  activeTargetId = null;
  modalReturn.close();
  renderList(inputSearch?.value || '');
});

const modalRenew = document.getElementById('modal-renew');
const closeRenewBtn = document.getElementById('close-modal-renew');
const cancelRenewBtn = document.getElementById('cancel-renew');
const confirmRenewBtn = document.getElementById('confirm-renew');
const renewDateInput = document.getElementById('renew-date');
const renewUserNameEl = document.getElementById('renew-user-name');
const renewBookNameEl = document.getElementById('renew-book-name');

function handleRenewAction(id) {
  const rentals = getRentals();
  const rental = rentals.find((item) => item.id === id);
  if (!rental) return;

  if (rental.status === 'Inativo') {
    alert('Não é possível renovar um livro que já foi devolvido.');
    return;
  }

  activeTargetId = id;

  if (renewUserNameEl) renewUserNameEl.textContent = rental.userName;
  if (renewBookNameEl) renewBookNameEl.textContent = rental.bookName;

  const baseDate = rental.endDate ? new Date(rental.endDate + 'T00:00:00') : new Date();
  baseDate.setDate(baseDate.getDate() + 7);
  if (renewDateInput) {
    renewDateInput.value = baseDate.toISOString().split('T')[0];
  }

  modalRenew.showModal();
}

closeRenewBtn?.addEventListener('click', () => modalRenew.close());
cancelRenewBtn?.addEventListener('click', () => modalRenew.close());
setupBackdropClose(modalRenew);

confirmRenewBtn?.addEventListener('click', () => {
  if (!activeTargetId) return;

  if (!renewDateInput.value) {
    alert('Por favor, informe a nova data de devolução.');
    return;
  }

  let rentals = getRentals();
  rentals = rentals.map((item) => {
    if (item.id === activeTargetId) {
      return {
        ...item,
        endDate: renewDateInput.value,
        status: 'Ativo'
      };
    }
    return item;
  });

  saveRentals(rentals);
  activeTargetId = null;
  modalRenew.close();
  renderList(inputSearch?.value || '');
});

function renderList(query = '') {
  if (!containerList) return;

  const existingRows = containerList.querySelectorAll('.container-table, .line-item-hr');
  existingRows.forEach((row) => row.remove());

  const pagination = containerList.querySelector('.btn-next-page');
  const rentals = getRentals();
  const filter = query.trim().toLowerCase();
  const selectedStatus = selectFilterStatus?.value || 'todos';
  const selectedSort = selectFilterSort?.value || 'recentes';

  let filtered = rentals.filter((item) => {
    const matchesSearch =
      (item.userName || '').toLowerCase().includes(filter) ||
      (item.bookName || '').toLowerCase().includes(filter) ||
      (item.status || '').toLowerCase().includes(filter);

    let matchesStatus = true;
    if (selectedStatus === 'Ativo') {
      matchesStatus = item.status === 'Ativo';
    } else if (selectedStatus === 'Inativo') {
      matchesStatus = item.status === 'Inativo';
    } else if (selectedStatus === 'Atrasado') {
      matchesStatus = isAtrasado(item);
    }

    return matchesSearch && matchesStatus;
  });

  if (selectedSort === 'nome') {
    filtered.sort((a, b) => (a.userName || '').localeCompare(b.userName || ''));
  } else if (selectedSort === 'vencimento') {
    filtered.sort((a, b) => (a.endDate || '').localeCompare(b.endDate || ''));
  } else {
    filtered.sort((a, b) => Number(b.id) - Number(a.id));
  }

  filtered.forEach((rental) => {
    const isAtivo = rental.status === 'Ativo';
    const atrasado = isAtrasado(rental);

    let displayStatus = rental.status;
    let statusColor = isAtivo ? '#2ecc71' : '#e74c3c';

    if (atrasado) {
      displayStatus = 'Atrasado';
      statusColor = '#e67e22';
    }

    const row = document.createElement('div');
    row.className = 'container-table';
    row.innerHTML = `
      <p class="name-p">${rental.userName}</p>
      <p class="book-p">${rental.bookName}</p>
      <p class="date-start-p">${formatDateBR(rental.startDate)}</p>
      <p class="date-end-p">${formatDateBR(rental.endDate)}</p>
      <p class="status-p" style="color: ${statusColor}; font-weight: bold;">
        ${displayStatus}
      </p>
      <div class="container-btns">
        <button class="btn-return" data-id="${rental.id}">Devolver</button>
        <button class="btn-renew" data-id="${rental.id}">Renovar</button>
      </div>
    `;

    const hr = document.createElement('hr');
    hr.className = 'line-item-hr';

    if (pagination) {
      containerList.insertBefore(row, pagination);
      containerList.insertBefore(hr, pagination);
    } else {
      containerList.appendChild(row);
      containerList.appendChild(hr);
    }
  });

  containerList.querySelectorAll('.btn-return').forEach((btn) => {
    btn.addEventListener('click', () => handleReturnAction(btn.dataset.id));
  });

  containerList.querySelectorAll('.btn-renew').forEach((btn) => {
    btn.addEventListener('click', () => handleRenewAction(btn.dataset.id));
  });
}

inputSearch?.addEventListener('input', (e) => {
  renderList(e.target.value);
});

setupDataLists();
setupFilterUI();
renderList();