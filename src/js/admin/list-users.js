const STORAGE_KEY_USERS = '@biblioteca:usuarios';
const STORAGE_KEY_RENTALS = '@biblioteca:alugueis';

const containerList = document.querySelector('.container-list');
const inputSearch = document.querySelector('.input-search');

const modalStatus = document.getElementById('modal-status');
const closeBtnStatus = document.getElementById('close-modal-status');
const cancelBtnStatus = document.getElementById('cancel-status');
const confirmBtnStatus = document.getElementById('confirm-status');

const userNameEl = document.getElementById('status-user-name');
const userCpfEl = document.getElementById('status-user-cpf');
const statusMsgConfirmEl = document.getElementById('status-msg-confirm') || modalStatus?.querySelector('.confirm-message p');
const statusMsgWarningEl = document.getElementById('status-msg-warning') || modalStatus?.querySelector('.warning-text');

let selectedUserCpf = null;
let targetNewStatus = null;

function getUsers() {
  const data = localStorage.getItem(STORAGE_KEY_USERS);
  return data ? JSON.parse(data) : [];
}

function saveUsers(data) {
  localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(data));
}

function getRentals() {
  const data = localStorage.getItem(STORAGE_KEY_RENTALS);
  return data ? JSON.parse(data) : [];
}

function formatDateBR(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function hasOverdueRental(userCpf, userName) {
  const rentals = getRentals();
  const cleanUserCpf = (userCpf || '').replace(/\D/g, '');
  const today = new Date().toISOString().split('T')[0];

  return rentals.some((r) => {
    const matchCpf = cleanUserCpf && (r.cpf || '').replace(/\D/g, '') === cleanUserCpf;
    const matchName = (r.userName || '').trim().toLowerCase() === (userName || '').trim().toLowerCase();
    const isUser = matchCpf || matchName;
    const isAtivo = r.status !== 'Inativo';
    const isVencido = r.endDate && r.endDate < today;

    return isUser && isAtivo && isVencido;
  });
}

function abrirModalStatus(nome, cpf, novoStatus) {
  selectedUserCpf = cpf;
  targetNewStatus = novoStatus;

  if (userNameEl && userCpfEl) {
    userNameEl.textContent = nome;
    userCpfEl.textContent = cpf;
  }

  if (novoStatus === 'Inativo') {
    const atrasado = hasOverdueRental(cpf, nome);
    if (atrasado) {
      if (statusMsgConfirmEl) statusMsgConfirmEl.textContent = 'Este usuário possui livros com devolução em atraso!';
      if (statusMsgWarningEl) statusMsgWarningEl.textContent = 'O usuário será inativado por conta do atraso na devolução do livro.';
    } else {
      if (statusMsgConfirmEl) statusMsgConfirmEl.textContent = 'Deseja realmente desativar este usuário?';
      if (statusMsgWarningEl) statusMsgWarningEl.textContent = 'O usuário perderá o acesso caso seja desativado.';
    }
  } else {
    if (statusMsgConfirmEl) statusMsgConfirmEl.textContent = 'Deseja reativar este usuário?';
    if (statusMsgWarningEl) statusMsgWarningEl.textContent = 'O usuário voltará a ter acesso normal ao sistema.';
  }

  modalStatus.showModal();
}

[closeBtnStatus, cancelBtnStatus].forEach((btn) => {
  btn?.addEventListener('click', () => {
    modalStatus.close();
  });
});

modalStatus.addEventListener('click', (e) => {
  const rect = modalStatus.getBoundingClientRect();
  const clickedInDialog = (
    rect.top <= e.clientY &&
    e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX &&
    e.clientX <= rect.left + rect.width
  );
  if (!clickedInDialog) {
    modalStatus.close();
  }
});

confirmBtnStatus?.addEventListener('click', () => {
  if (!selectedUserCpf || !targetNewStatus) {
    modalStatus.close();
    return;
  }

  let users = getUsers();
  users = users.map((u) => {
    if (u.cpf === selectedUserCpf) {
      return { ...u, status: targetNewStatus };
    }
    return u;
  });

  saveUsers(users);

  selectedUserCpf = null;
  targetNewStatus = null;
  modalStatus.close();
  renderList(inputSearch?.value || '');
});

function renderList(query = '') {
  if (!containerList) return;

  const existingDynamicElements = containerList.querySelectorAll('.container-table, .user-separator-hr');
  existingDynamicElements.forEach((el) => el.remove());

  const pagination = containerList.querySelector('.btn-next-page');
  const users = getUsers();
  const filter = query.trim().toLowerCase();

  const filtered = users.filter((u) => {
    const nome = (u.nome || u.name || '').toLowerCase();
    const cpf = (u.cpf || '').toLowerCase();
    const endereco = (u.endereco || '').toLowerCase();
    return nome.includes(filter) || cpf.includes(filter) || endereco.includes(filter);
  });

  filtered.forEach((user) => {
    const isAtivo = (user.status || 'Ativo') === 'Ativo';
    const row = document.createElement('div');
    row.className = 'container-table';

    row.innerHTML = `
      <p class="name-p">${user.nome || user.name || '-'}</p>
      <p class="cpf-p">${user.cpf || '-'}</p>
      <p class="date-birth-p">${formatDateBR(user.nascimento || user.dataNascimento)}</p>
      <p class="address-p">${user.endereco || '-'}</p>
      <p class="status-p ${isAtivo ? 'status-active' : 'status-inactive'}" style="color: ${isAtivo ? '#2ecc71' : '#e74c3c'}; font-weight: bold;">
        ${isAtivo ? 'ATIVADO' : 'DESATIVADO'}
      </p>
      <div class="container-btns">
        <button class="btn-activate" ${isAtivo ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>ATIVAR</button>
        <button class="btn-deactivate" ${!isAtivo ? 'disabled style="opacity: 0.5; cursor: not-allowed;"' : ''}>DESATIVAR</button>
      </div>
    `;

    row.querySelector('.btn-activate').addEventListener('click', () => {
      abrirModalStatus(user.nome || user.name, user.cpf, 'Ativo');
    });

    row.querySelector('.btn-deactivate').addEventListener('click', () => {
      abrirModalStatus(user.nome || user.name, user.cpf, 'Inativo');
    });

    const hr = document.createElement('hr');
    hr.className = 'user-separator-hr';

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