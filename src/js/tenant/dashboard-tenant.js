let STORAGE_KEY_RENTALS = '@biblioteca:alugueis';
let STORAGE_KEY_BOOKS = '@biblioteca:livros';
let STORAGE_KEY_LOGGED = 'usuario_logado';

function getData(key) {
    let data = localStorage.getItem(key);
    if (data) {
        return JSON.parse(data);
    }
    return [];
}

function getLoggedUser() {
    let data = localStorage.getItem(STORAGE_KEY_LOGGED);
    if (data) {
        return JSON.parse(data);
    }
    return null;
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

function initTenantDashboard() {
    let loggedUser = getLoggedUser();
    let rentals = getData(STORAGE_KEY_RENTALS);
    let books = getData(STORAGE_KEY_BOOKS);

    let userImgEl = document.querySelector('.container-dashboard-header .img-user');
    if (userImgEl) {
        if (loggedUser && loggedUser.foto && loggedUser.foto.indexOf('data:image') == 0) {
            userImgEl.src = loggedUser.foto;
        } else {
            userImgEl.src = '../../imgs/user.svg';
        }

        userImgEl.onerror = function () {
            userImgEl.src = '../../imgs/user.svg';
        };
    }

    let tenantNameEl = document.getElementById('tenant-logged-name');
    if (tenantNameEl && loggedUser) {
        let nomeCompleto = loggedUser.nome || loggedUser.name || 'Usuário';
        let partesNome = nomeCompleto.split(' ');
        tenantNameEl.textContent = partesNome[0];
    }

    let userCpf = '';
    if (loggedUser && loggedUser.cpf) {
        userCpf = loggedUser.cpf.split('.').join('').split('-').join('').split(' ').join('');
    }

    let userName = '';
    if (loggedUser) {
        let nomeTemp = loggedUser.nome || loggedUser.name || '';
        userName = nomeTemp.trim().toLowerCase();
    }

    let userRentals = [];
    for (let i = 0; i < rentals.length; i++) {
        let r = rentals[i];
        let rCpf = '';
        if (r.cpf) {
            rCpf = r.cpf.split('.').join('').split('-').join('').split(' ').join('');
        }

        let rName = (r.userName || '').trim().toLowerCase();

        let matchCpf = userCpf != '' && rCpf == userCpf;
        let matchName = rName == userName;

        if (matchCpf || matchName) {
            userRentals.push(r);
        }
    }

    let latestList = document.getElementById('tenant-latest-rentals');
    if (latestList) {
        latestList.innerHTML = '';

        let recent = [];
        for (let i = userRentals.length - 1; i >= 0; i--) {
            recent.push(userRentals[i]);
            if (recent.length == 5) {
                break;
            }
        }

        if (recent.length == 0) {
            latestList.innerHTML = '<li>Nenhum aluguel realizado até o momento</li>';
        } else {
            for (let i = 0; i < recent.length; i++) {
                let li = document.createElement('li');
                let nomeLivro = recent[i].bookName || 'Livro não especificado';
                li.textContent = (i + 1) + '. ' + nomeLivro;
                latestList.appendChild(li);
            }
        }
    }

    let statusTable = document.getElementById('tenant-status-table');
    if (statusTable) {
        statusTable.innerHTML = '';

        let activeRentals = [];
        for (let i = 0; i < userRentals.length; i++) {
            if (userRentals[i].status != 'Inativo') {
                activeRentals.push(userRentals[i]);
            }
        }

        if (activeRentals.length == 0) {
            statusTable.innerHTML = '<div class="status-row"><span>Nenhum livro pendente de devolução</span></div>';
        } else {
            let today = new Date();
            let hojeAno = today.getFullYear();
            let hojeMes = String(today.getMonth() + 1).padStart(2, '0');
            let hojeDia = String(today.getDate()).padStart(2, '0');
            let hojeFormatado = hojeAno + '-' + hojeMes + '-' + hojeDia;

            for (let i = 0; i < activeRentals.length; i++) {
                let r = activeRentals[i];
                let tagClass = 'tag-green';
                let tagText = 'EM DIA';

                if (r.endDate) {
                    if (r.endDate < hojeFormatado) {
                        tagClass = 'tag-red';
                        tagText = 'ATRASADO';
                    } else {
                        let partesData = r.endDate.split('-');
                        let dataFim = new Date(partesData[0], partesData[1] - 1, partesData[2]);
                        let dataHoje = new Date(hojeAno, today.getMonth(), hojeDia);

                        let diferencaMilisegundos = dataFim.getTime() - dataHoje.getTime();
                        let diffDays = Math.ceil(diferencaMilisegundos / (1000 * 60 * 60 * 24));

                        if (diffDays <= 3) {
                            tagClass = 'tag-yellow';
                            tagText = 'PERTO DE VENCER';
                        }
                    }
                }

                let row = document.createElement('div');
                row.className = 'status-row';
                row.innerHTML =
                    '<span>' + r.bookName + ' | ' + formatDateBR(r.startDate) + ' | ' + formatDateBR(r.endDate) + '</span>' +
                    '<span class="status-tag ' + tagClass + '">' + tagText + '</span>';

                statusTable.appendChild(row);
            }
        }
    }

    let availableList = document.getElementById('available-books-list');
    if (availableList) {
        availableList.innerHTML = '';

        let topBooks = [];
        for (let i = 0; i < books.length; i++) {
            topBooks.push(books[i]);
            if (topBooks.length == 5) {
                break;
            }
        }

        if (topBooks.length == 0) {
            availableList.innerHTML =
                '<div class="item-qty">' +
                '<span>Nenhum livro disponível no catálogo</span>' +
                '<span>qtd. 0</span>' +
                '</div>';
        } else {
            for (let i = 0; i < topBooks.length; i++) {
                let b = topBooks[i];
                let titulo = b.titulo || b.title || b.livro || b.nome || '-';
                let qtd = 0;
                if (b.quantidade != undefined) {
                    qtd = b.quantidade;
                } else if (b.qtd != undefined) {
                    qtd = b.qtd;
                }

                let item = document.createElement('div');
                item.className = 'item-qty';
                item.innerHTML =
                    '<span>' + (i + 1) + '. ' + titulo + '</span>' +
                    '<span>qtd. ' + qtd + '</span>';

                availableList.appendChild(item);
            }
        }
    }

    let bookCounts = {};
    for (let i = 0; i < rentals.length; i++) {
        let nome = (rentals[i].bookName || '').trim();
        if (nome != '') {
            if (bookCounts[nome]) {
                bookCounts[nome] = bookCounts[nome] + 1;
            } else {
                bookCounts[nome] = 1;
            }
        }
    }

    let champName = '';
    let champQty = 0;

    for (let nome in bookCounts) {
        if (bookCounts[nome] > champQty) {
            champQty = bookCounts[nome];
            champName = nome;
        }
    }

    let titleEl = document.getElementById('most-rented-title');
    let publisherEl = document.getElementById('most-rented-publisher');
    let releaseEl = document.getElementById('most-rented-release');
    let qtyEl = document.getElementById('most-rented-quantity');

    if (champQty > 0) {
        let foundBook = null;
        for (let i = 0; i < books.length; i++) {
            let b = books[i];
            let tituloLivro = (b.titulo || b.title || b.livro || b.nome || '').trim().toLowerCase();
            if (tituloLivro == champName.toLowerCase()) {
                foundBook = b;
                break;
            }
        }

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

window.onload = function () {
    initTenantDashboard();
};