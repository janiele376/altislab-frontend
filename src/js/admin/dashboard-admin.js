function buscarDados(chaves) {
    for (let i = 0; i < chaves.length; i++) {
        let texto = localStorage.getItem(chaves[i]);
        if (texto) {
            let lista = JSON.parse(texto);
            if (lista && lista.length > 0) {
                return lista;
            }
        }
    }
    return [];
}

function formatarDataBR(dataStr) {
    if (!dataStr) return '-';
    let partes = dataStr.split('-');
    if (partes.length != 3) return dataStr;
    return partes[2] + '/' + partes[1] + '/' + partes[0];
}

function initDashboard() {
    let rentals = buscarDados(['@biblioteca:alugueis', 'alugueis', 'rentals']);
    let books = buscarDados(['@biblioteca:livros', 'livros', 'books']);
    let publishers = buscarDados(['@biblioteca:editoras', 'editoras', 'publishers']);

    let today = new Date();
    let anoHoje = today.getFullYear();
    let mesHoje = String(today.getMonth() + 1).padStart(2, '0');
    let diaHoje = String(today.getDate()).padStart(2, '0');
    let hojeFormatado = anoHoje + '-' + mesHoje + '-' + diaHoje;

    let emDia = 0;
    let pertoVencer = 0;
    let emAtraso = 0;

    for (let i = 0; i < rentals.length; i++) {
        let r = rentals[i];

        if (r.status == 'Inativo') {
            continue;
        }

        if (!r.endDate) {
            emDia = emDia + 1;
            continue;
        }

        if (r.endDate < hojeFormatado) {
            emAtraso = emAtraso + 1;
        } else {
            let partes = r.endDate.split('-');
            let fim = new Date(partes[0], partes[1] - 1, partes[2]);
            let agora = new Date(anoHoje, today.getMonth(), diaHoje);

            let diffDias = Math.ceil((fim.getTime() - agora.getTime()) / (1000 * 60 * 60 * 24));

            if (diffDias <= 3) {
                pertoVencer = pertoVencer + 1;
            } else {
                emDia = emDia + 1;
            }
        }
    }

    let cardOnTime = document.getElementById('card-ontime-val');
    let cardExpiring = document.getElementById('card-expiring-val');
    let cardLate = document.getElementById('card-late-val');

    if (cardOnTime) cardOnTime.textContent = emDia + ' Aluguéis';
    if (cardExpiring) cardExpiring.textContent = pertoVencer + ' Aluguéis';
    if (cardLate) cardLate.textContent = emAtraso + ' Aluguéis';

    let globalRentals = document.getElementById('global-rentals-count');
    let globalBooks = document.getElementById('global-books-count');
    let globalPublishers = document.getElementById('global-publishers-count');

    if (globalRentals) globalRentals.textContent = rentals.length;
    if (globalBooks) globalBooks.textContent = books.length;
    if (globalPublishers) globalPublishers.textContent = publishers.length;

    let latestList = document.getElementById('latest-rentals-list');
    if (latestList) {
        latestList.innerHTML = '';

        if (rentals.length == 0) {
            latestList.innerHTML = '<li>Nenhum aluguel registrado</li>';
        } else {
            let contador = 0;
            for (let i = rentals.length - 1; i >= 0; i--) {
                let nome = rentals[i].bookName || rentals[i].titulo || rentals[i].livro || 'Livro não informado';
                let li = document.createElement('li');
                li.textContent = nome;
                latestList.appendChild(li);

                contador = contador + 1;
                if (contador == 5) {
                    break;
                }
            }
        }
    }

    let contagemLivros = {};
    for (let i = 0; i < rentals.length; i++) {
        let nome = rentals[i].bookName || rentals[i].titulo || rentals[i].livro || '';
        nome = nome.trim();

        if (nome != '') {
            if (contagemLivros[nome]) {
                contagemLivros[nome] = contagemLivros[nome] + 1;
            } else {
                contagemLivros[nome] = 1;
            }
        }
    }

    let listaOrdenada = [];
    for (let nome in contagemLivros) {
        listaOrdenada.push({ nome: nome, qtd: contagemLivros[nome] });
    }

    for (let i = 0; i < listaOrdenada.length; i++) {
        for (let j = i + 1; j < listaOrdenada.length; j++) {
            if (listaOrdenada[j].qtd > listaOrdenada[i].qtd) {
                let temp = listaOrdenada[i];
                listaOrdenada[i] = listaOrdenada[j];
                listaOrdenada[j] = temp;
            }
        }
    }

    let topBooksList = document.getElementById('top-rented-books-list');
    if (topBooksList) {
        topBooksList.innerHTML = '';

        if (listaOrdenada.length == 0) {
            topBooksList.innerHTML =
                '<div class="item-qty">' +
                '<span>Nenhum aluguel computado</span>' +
                '<span>qtd. 0</span>' +
                '</div>';
        } else {
            let limite = listaOrdenada.length;
            if (limite > 3) {
                limite = 3;
            }

            for (let i = 0; i < limite; i++) {
                let item = document.createElement('div');
                item.className = 'item-qty';
                item.innerHTML =
                    '<span>' + (i + 1) + '. ' + listaOrdenada[i].nome + '</span>' +
                    '<span>qtd. ' + listaOrdenada[i].qtd + '</span>';
                topBooksList.appendChild(item);
            }
        }
    }

    let titleEl = document.getElementById('most-rented-title');
    let publisherEl = document.getElementById('most-rented-publisher');
    let releaseEl = document.getElementById('most-rented-release');
    let qtyEl = document.getElementById('most-rented-quantity');

    if (listaOrdenada.length > 0) {
        let maisAlugadoNome = listaOrdenada[0].nome;
        let maisAlugadoQtd = listaOrdenada[0].qtd;

        let livroEncontrado = null;
        for (let i = 0; i < books.length; i++) {
            let b = books[i];
            let titulo = (b.titulo || b.title || b.livro || b.nome || '').trim().toLowerCase();
            if (titulo == maisAlugadoNome.toLowerCase()) {
                livroEncontrado = b;
                break;
            }
        }

        if (titleEl) titleEl.textContent = maisAlugadoNome;
        if (publisherEl) publisherEl.textContent = livroEncontrado ? (livroEncontrado.editora || livroEncontrado.publisher || '-') : '-';
        if (releaseEl) releaseEl.textContent = livroEncontrado ? formatarDataBR(livroEncontrado.lancamento || livroEncontrado.dataLancamento) : '-';
        if (qtyEl) qtyEl.textContent = maisAlugadoQtd;
    } else {
        if (titleEl) titleEl.textContent = '-';
        if (publisherEl) publisherEl.textContent = '-';
        if (releaseEl) releaseEl.textContent = '-';
        if (qtyEl) qtyEl.textContent = '0';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    initDashboard();
});