const STORAGE_KEY_RENTALS = '@biblioteca:alugueis';
const STORAGE_KEY_BOOKS = '@biblioteca:livros';
const STORAGE_KEY_PUBLISHERS = '@biblioteca:editoras';

function getData(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function formatDateBR(dateStr) {
  if (!dateStr) return '-';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  return `${parts[2]}/${parts[1]}/${parts[0]}`;
}

function initDashboard() {
  const rentals = getData(STORAGE_KEY_RENTALS);
  const books = getData(STORAGE_KEY_BOOKS);
  const publishers = getData(STORAGE_KEY_PUBLISHERS);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let emDia = 0;
  let pertoVencer = 0;
  let emAtraso = 0;

  rentals.forEach((rental) => {
    if (rental.status === 'Inativo') return;

    if (!rental.endDate) {
      emDia++;
      return;
    }

    const [year, month, day] = rental.endDate.split('-').map(Number);
    const endDate = new Date(year, month - 1, day);
    endDate.setHours(0, 0, 0, 0);

    const diffDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      emAtraso++;
    } else if (diffDays <= 3) {
      pertoVencer++;
    } else {
      emDia++;
    }
  });

  const cardOnTime = document.getElementById('card-ontime-val');
  const cardExpiring = document.getElementById('card-expiring-val');
  const cardLate = document.getElementById('card-late-val');

  if (cardOnTime) cardOnTime.textContent = `${emDia} Aluguéis`;
  if (cardExpiring) cardExpiring.textContent = `${pertoVencer} Aluguéis`;
  if (cardLate) cardLate.textContent = `${emAtraso} Aluguéis`;

  const globalRentals = document.getElementById('global-rentals-count');
  const globalBooks = document.getElementById('global-books-count');
  const globalPublishers = document.getElementById('global-publishers-count');

  if (globalRentals) globalRentals.textContent = rentals.length;
  if (globalBooks) globalBooks.textContent = books.length;
  if (globalPublishers) globalPublishers.textContent = publishers.length;

  const latestList = document.getElementById('latest-rentals-list');
  if (latestList) {
    latestList.innerHTML = '';
    const recentRentals = [...rentals].reverse().slice(0, 5);

    if (recentRentals.length === 0) {
      latestList.innerHTML = '<li>Nenhum aluguel registrado</li>';
    } else {
      recentRentals.forEach((r, idx) => {
        const li = document.createElement('li');
        li.textContent = `${idx + 1}. ${r.bookName || 'Livro não informado'}`;
        latestList.appendChild(li);
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

  const sortedBooks = Object.entries(bookCounts).sort((a, b) => b[1] - a[1]);

  const topBooksList = document.getElementById('top-rented-books-list');
  if (topBooksList) {
    topBooksList.innerHTML = '';
    const top3 = sortedBooks.slice(0, 3);

    if (top3.length === 0) {
      topBooksList.innerHTML = `
        <div class="item-qty">
          <span>Nenhum aluguel computado</span>
          <span>qtd. 0</span>
        </div>`;
    } else {
      top3.forEach(([nome, qtd], idx) => {
        const item = document.createElement('div');
        item.className = 'item-qty';
        item.innerHTML = `
          <span>${idx + 1}. ${nome}</span>
          <span>qtd. ${qtd}</span>
        `;
        topBooksList.appendChild(item);
      });
    }
  }

  const titleEl = document.getElementById('most-rented-title');
  const publisherEl = document.getElementById('most-rented-publisher');
  const releaseEl = document.getElementById('most-rented-release');
  const qtyEl = document.getElementById('most-rented-quantity');

  if (sortedBooks.length > 0) {
    const [championName, championQty] = sortedBooks[0];
    const foundBook = books.find(
      (b) => (b.titulo || b.title || b.livro || b.nome || '').trim().toLowerCase() === championName.toLowerCase()
    );

    if (titleEl) titleEl.textContent = championName;
    if (publisherEl) publisherEl.textContent = foundBook ? (foundBook.editora || foundBook.publisher || '-') : '-';
    if (releaseEl) releaseEl.textContent = foundBook ? formatDateBR(foundBook.lancamento || foundBook.dataLancamento) : '-';
    if (qtyEl) qtyEl.textContent = championQty;
  } else {
    if (titleEl) titleEl.textContent = '-';
    if (publisherEl) publisherEl.textContent = '-';
    if (releaseEl) releaseEl.textContent = '-';
    if (qtyEl) qtyEl.textContent = '0';
  }
}

document.addEventListener('DOMContentLoaded', initDashboard);