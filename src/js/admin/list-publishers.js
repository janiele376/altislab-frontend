const STORAGE_KEY_PUBLISHERS = '@biblioteca:editoras';

const containerList = document.querySelector('.container-list');
const inputSearch = document.querySelector('.input-search');

const modalCreate = document.getElementById('modal-create');
const openCreateBtn = document.getElementById('open-modal-create');
const closeCreateBtn = document.getElementById('close-modal-create');
const cancelCreateBtn = document.getElementById('cancel-create');
const confirmCreateBtn = modalCreate?.querySelector('.btn-check');

const titleModalCreate = modalCreate?.querySelector('.title-rental-form');
const inputPublisherName = modalCreate?.querySelector('.publisher-name');
const inputPublisherCnpj = modalCreate?.querySelector('.publisher-cnpj');
const inputPublisherEmail = modalCreate?.querySelector('.publisher-email');
const inputPublisherPhone = modalCreate?.querySelector('.publisher-phone');
const inputPublisherAddress = modalCreate?.querySelector('.publisher-address');

const modalDelete = document.getElementById('modal-delete');
const closeDeleteBtn = document.getElementById('close-modal-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');
const deletePublisherId = document.getElementById('delete-publisher-id');
const deletePublisherName = document.getElementById('delete-publisher-name');

let editandoId = null;

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

function getPublishers() {
  const data = localStorage.getItem(STORAGE_KEY_PUBLISHERS);
  return data ? JSON.parse(data) : [];
}

function savePublishers(data) {
  localStorage.setItem(STORAGE_KEY_PUBLISHERS, JSON.stringify(data));
}

openCreateBtn?.addEventListener('click', () => {
  editandoId = null;
  if (titleModalCreate) titleModalCreate.textContent = 'Criar Editora';
  if (inputPublisherName) inputPublisherName.value = '';
  if (inputPublisherCnpj) inputPublisherCnpj.value = '';
  if (inputPublisherEmail) inputPublisherEmail.value = '';
  if (inputPublisherPhone) inputPublisherPhone.value = '';
  if (inputPublisherAddress) inputPublisherAddress.value = '';
  modalCreate.showModal();
});

[closeCreateBtn, cancelCreateBtn].forEach(btn => {
  btn?.addEventListener('click', () => modalCreate.close());
});

function abrirModalEditar(id, nome, cnpj, email, telefone, endereco) {
  editandoId = String(id);
  if (titleModalCreate) titleModalCreate.textContent = 'Editar Editora';
  if (inputPublisherName) inputPublisherName.value = nome || '';
  if (inputPublisherCnpj) inputPublisherCnpj.value = cnpj || '';
  if (inputPublisherEmail) inputPublisherEmail.value = email || '';
  if (inputPublisherPhone) inputPublisherPhone.value = telefone || '';
  if (inputPublisherAddress) inputPublisherAddress.value = endereco || '';
  modalCreate.showModal();
}

function abrirModalExcluir(id, nome) {
  if (deletePublisherId && deletePublisherName) {
    deletePublisherId.textContent = id;
    deletePublisherName.textContent = nome;
  }
  modalDelete.showModal();
}

[closeDeleteBtn, cancelDeleteBtn].forEach(btn => {
  btn?.addEventListener('click', () => modalDelete.close());
});

confirmCreateBtn?.addEventListener('click', (e) => {
  e.preventDefault();

  const nome = inputPublisherName?.value.trim();
  const cnpj = inputPublisherCnpj?.value.trim();
  const email = inputPublisherEmail?.value.trim();
  const telefone = inputPublisherPhone?.value.trim();
  const endereco = inputPublisherAddress?.value.trim();

  if (!nome) {
    alert('Por favor, informe o Nome da editora.');
    return;
  }

  let publishers = getPublishers();

  if (editandoId) {
    publishers = publishers.map(p => {
      if (String(p.id) === editandoId) {
        return { ...p, nome, cnpj, email, telefone, endereco };
      }
      return p;
    });
  } else {
    const nextId = publishers.length > 0
      ? String(Math.max(...publishers.map(p => Number(p.id) || 0)) + 1)
      : '1';

    publishers.push({
      id: nextId,
      nome,
      cnpj,
      email,
      telefone,
      endereco
    });
  }

  savePublishers(publishers);
  modalCreate.close();
  renderList(inputSearch?.value || '');
});

confirmDeleteBtn?.addEventListener('click', () => {
  const id = deletePublisherId?.textContent;
  if (!id) return;

  let publishers = getPublishers();
  publishers = publishers.filter(p => String(p.id) !== id);
  savePublishers(publishers);

  modalDelete.close();
  renderList(inputSearch?.value || '');
});

function renderList(query = '') {
  if (!containerList) return;

  containerList.querySelectorAll('.container-table').forEach(el => el.remove());
  containerList.querySelectorAll('hr:not(.line-search):not(.line-header-divider)').forEach(el => el.remove());

  const pagination = containerList.querySelector('.btn-next-page');
  const publishers = getPublishers();
  const filter = query.trim().toLowerCase();

  const filtered = publishers.filter(p => {
    const nome = (p.nome || p.name || '').toLowerCase();
    const cnpj = (p.cnpj || '').toLowerCase();
    const email = (p.email || '').toLowerCase();
    const endereco = (p.endereco || p.cidade || '').toLowerCase();
    return nome.includes(filter) || cnpj.includes(filter) || email.includes(filter) || endereco.includes(filter);
  });

  filtered.forEach(pub => {
    const id = pub.id || '-';
    const nome = pub.nome || pub.name || '-';
    const cnpj = pub.cnpj || '';
    const email = pub.email || '';
    const telefone = pub.telefone || pub.phone || '';
    const contato = [email, telefone].filter(Boolean).join(' | ') || '-';
    const endereco = pub.endereco || pub.cidade || '-';

    const row = document.createElement('div');
    row.className = 'container-table';
    row.innerHTML = `
      <p class="id-p">${id}</p>
      <p class="name-p">${nome}</p>
      <p class="contact-p">${contato}</p>
      <p class="address-p">${endereco}</p>
      <div class="container-btns">
        <button class="btn-edit">Editar</button>
        <button class="btn-delete">Excluir</button>
      </div>
    `;

    row.querySelector('.btn-edit').addEventListener('click', () => {
      abrirModalEditar(id, nome, cnpj, email, telefone, endereco);
    });

    row.querySelector('.btn-delete').addEventListener('click', () => {
      abrirModalExcluir(id, nome);
    });

    const hr = document.createElement('hr');
    hr.className = 'publisher-separator-hr';

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