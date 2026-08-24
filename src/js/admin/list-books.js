const modalCreate = document.getElementById('modal-create');
const openCreateBtn = document.getElementById('open-modal-create');
const closeCreateBtn = document.getElementById('close-modal-create');
const cancelCreateBtn = document.getElementById('cancel-create');

const modalDelete = document.getElementById('modal-delete');
const closeDeleteBtn = document.getElementById('close-modal-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');

const deleteBookCod = document.getElementById('delete-book-cod');
const deleteBookName = document.getElementById('delete-book-name');

function fecharNoBackdrop(dialog) {
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

openCreateBtn?.addEventListener('click', () => {
    modalCreate.querySelector('.title-rental-form').textContent = 'Criar Livro';
    modalCreate.querySelector('.book-name').value = '';
    modalCreate.querySelector('.book-cod').value = '';
    modalCreate.querySelector('.book-publisher').value = '';
    modalCreate.querySelector('.book-date').value = '';
    modalCreate.showModal();
});

[closeCreateBtn, cancelCreateBtn].forEach(btn => {
    btn?.addEventListener('click', () => modalCreate.close());
});

function abrirModalEditar(cod, nome, editora, data) {
    modalCreate.querySelector('.title-rental-form').textContent = 'Editar Livro';
    modalCreate.querySelector('.book-name').value = nome;
    modalCreate.querySelector('.book-cod').value = cod;
    modalCreate.querySelector('.book-publisher').value = editora;
    modalCreate.querySelector('.book-date').value = data;
    modalCreate.showModal();
}

function abrirModalExcluir(cod, nome) {
    if (deleteBookCod && deleteBookName) {
        deleteBookCod.textContent = cod;
        deleteBookName.textContent = nome;
    }
    modalDelete.showModal();
}

[closeDeleteBtn, cancelDeleteBtn].forEach(btn => {
    btn?.addEventListener('click', () => modalDelete.close());
});

confirmDeleteBtn?.addEventListener('click', () => {
    console.log(`Livro ${deleteBookName.textContent} (Cód: ${deleteBookCod.textContent}) excluído com sucesso.`);
    modalDelete.close();
});