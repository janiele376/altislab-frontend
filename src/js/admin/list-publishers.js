const modalCreate = document.getElementById('modal-create');
const openCreateBtn = document.getElementById('open-modal-create');
const closeCreateBtn = document.getElementById('close-modal-create');
const cancelCreateBtn = document.getElementById('cancel-create');

const modalDelete = document.getElementById('modal-delete');
const closeDeleteBtn = document.getElementById('close-modal-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');

const deletePublisherId = document.getElementById('delete-publisher-id');
const deletePublisherName = document.getElementById('delete-publisher-name');

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
    modalCreate.querySelector('.title-rental-form').textContent = 'Criar Editora';
    modalCreate.querySelector('.publisher-name').value = '';
    modalCreate.querySelector('.publisher-cnpj').value = '';
    modalCreate.querySelector('.publisher-email').value = '';
    modalCreate.querySelector('.publisher-phone').value = '';
    modalCreate.querySelector('.publisher-address').value = '';
    modalCreate.showModal();
});

[closeCreateBtn, cancelCreateBtn].forEach(btn => {
    btn?.addEventListener('click', () => modalCreate.close());
});

function abrirModalEditar(id, nome, cnpj, email, telefone, endereco) {
    modalCreate.querySelector('.title-rental-form').textContent = 'Editar Editora';
    modalCreate.querySelector('.publisher-name').value = nome;
    modalCreate.querySelector('.publisher-cnpj').value = cnpj;
    modalCreate.querySelector('.publisher-email').value = email;
    modalCreate.querySelector('.publisher-phone').value = telefone;
    modalCreate.querySelector('.publisher-address').value = endereco;
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

confirmDeleteBtn?.addEventListener('click', () => {
    console.log(`Editora ${deletePublisherName.textContent} (ID: ${deletePublisherId.textContent}) excluída com sucesso.`);
    modalDelete.close();
});