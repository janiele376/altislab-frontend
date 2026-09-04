const STORAGE_KEY_RENTALS = '@biblioteca:alugueis';
const STORAGE_KEY_BOOKS = '@biblioteca:livros';
const STORAGE_KEY_LOGGED = 'usuario_logado';

function getData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function getLoggedUser() {
  const data = localStorage.getItem(STORAGE_KEY_LOGGED);
  return data ? JSON.parse(data) : null;
}

function formatDateBR(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function initTenantDashboard() {
  const loggedUser = getLoggedUser();
  const rentals = getData(STORAGE_KEY_RENTALS);
  const books = getData(STORAGE_KEY_BOOKS);

  // Validação segura da foto
  const userImgEl = document.querySelector('.container-dashboard-header .img-user');
  if (userImgEl) {
    if (loggedUser && loggedUser.foto && loggedUser.foto.startsWith('data:image')) {
      userImgEl.src = loggedUser.foto;
    } else {
      userImgEl.src = '../../imgs/user.svg';
    }

    userImgEl.onerror = function () {
      this.onerror = null;
      this.src = '../../imgs/user.svg';
    };
  }

  const tenantNameEl = document.getElementById('tenant-logged-name');
  if (tenantNameEl && loggedUser) {
    const nomeCompleto = loggedUser.nome || loggedUser.name || 'Usuário';
    tenantNameEl.textContent = nomeCompleto.split(' ')[0];
  }

  const userCpf = (loggedUser?.cpf || '').replace(/\D/g, '');
  const userName = (loggedUser?.nome || loggedUser?.name || '').trim().toLowerCase();

  const userRentals = rentals.filter((r) => {
    const matchCpf = userCpf && (r.cpf || '').replace(/\D/g, '') === userCpf;
    const matchName = (r.userName || '').trim().toLowerCase() === userName;
    return matchCpf || matchName;
  });

  const latestList = document.getElementById('tenant-latest-rentals');
  if (latestList) {
    latestList.innerHTML = '';
    const recent = [...userRentals].reverse().slice(0, 5);

    if (recent.length === 0) {
      latestList.innerHTML = '<li>Nenhum aluguel realizado até o momento</li>';
    } else {
      recent.forEach((r, idx) => {
        const li = document.createElement('li');
        li.textContent = `${idx + 1}. ${r.bookName || 'Livro não especificado'}`;
        latestList.appendChild(li);
      });
    }
  }

  const statusTable = document.getElementById('tenant-status-table');
  if (statusTable) {
    statusTable.innerHTML = '';
    const activeRentals = userRentals.filter((r) => r.status !== 'Inativo');

    if (activeRentals.length === 0) {
      statusTable.innerHTML = '<div class="status-row"><span>Nenhum livro pendente de devolução</span></div>';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      activeRentals.forEach((r) => {
        let tagClass = 'tag-green';
        let tagText = 'EM DIA';

        if (r.endDate) {
          const [y, m, d] = r.endDate.split('-').map(Number);
          const end = new Date(y, m - 1, d);
          end.setHours(0, 0, 0, 0);
          const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));

          if (diffDays < 0) {
            tagClass = 'tag-red';
            tagText = 'ATRASADO';
          } else if (diffDays <= 3) {
            tagClass = 'tag-yellow';
            tagText = 'PERTO DE VENCER';
          }
        }

        const row = document.createElement('div');
        row.className = 'status-row';
        row.innerHTML = `
          <span>${r.bookName} | ${formatDateBR(r.startDate)} | ${formatDateBR(r.endDate)}</span>
          <span class="status-tag ${tagClass}">${tagText}</span>
        `;
        statusTable.appendChild(row);
      });
    }
  }

  const availableList = document.getElementById('available-books-list');
  if (availableList) {
    availableList.innerHTML = '';
    const topBooks = books.slice(0, 5);

    if (topBooks.length === 0) {
      availableList.innerHTML = `
        <div class="item-qty">
          <span>Nenhum livro disponível no catálogo</span>
          <span>qtd. 0</span>
        </div>`;
    } else {
      topBooks.forEach((b, idx) => {
        const titulo = b.titulo || b.title || b.livro || b.nome || '-';
        const qtd = b.quantidade !== undefined ? b.quantidade : (b.qtd !== undefined ? b.qtd : 0);

        const item = document.createElement('div');
        item.className = 'item-qty';
        item.innerHTML = `
          <span>${idx + 1}. ${titulo}</span>
          <span>qtd. ${qtd}</span>
        `;
        availableList.appendChild(item);
      });
    }
  }

  const bookCounts = {};
  rentals.forEach((r) => {
    const nome = (r.bookName || '').trim();
    if (nome) {
      bookCounts[nome] = (bookCounts[nome] || 0) + 1;
    }
  });

  const sorted = Object.entries(bookCounts).sort((a, b) => b[1] - a[1]);

  const titleEl = document.getElementById('most-rented-title');
  const publisherEl = document.getElementById('most-rented-publisher');
  const releaseEl = document.getElementById('most-rented-release');
  const qtyEl = document.getElementById('most-rented-quantity');

  if (sorted.length > 0) {
    const [champName, champQty] = sorted[0];
    const foundBook = books.find(
      (b) => (b.titulo || b.title || b.livro || b.nome || '').trim().toLowerCase() === champName.toLowerCase()
    );

    if (titleEl) titleEl.textContent = champName;
    if (publisherEl) publisherEl.textContent = foundBook ? (foundBook.editora || foundBook.publisher || '-') : '-';
    if (releaseEl) releaseEl.textContent = foundBook ? formatDateBR(foundBook.lancamento || foundBook.dataLancamento) : '-';
    if (qtyEl) qtyEl.textContent = champQty;
  } else {
    if (titleEl) titleEl.textContent = '-';
    if (publisherEl) publisherEl.textContent = '-';
    if (releaseEl) releaseEl.textContent = '-';
    if (qtyEl) qtyEl.textContent = '0';
  }
}

document.addEventListener('DOMContentLoaded', initTenantDashboard);