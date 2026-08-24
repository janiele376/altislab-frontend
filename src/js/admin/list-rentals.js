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

//modal-create

const modalCreate = document.getElementById('modal');
const openCreateBtn = document.getElementById('open-modal');
const closeCreateBtn = document.getElementById('close-modal');
const cancelCreateBtn = modalCreate.querySelector('.btn-cancel');

openCreateBtn?.addEventListener('click', () => modalCreate.showModal());
closeCreateBtn?.addEventListener('click', () => modalCreate.close());
cancelCreateBtn?.addEventListener('click', () => modalCreate.close());
setupBackdropClose(modalCreate);

//modal-delete

const modalDelete = document.getElementById('modal-delete');
const openDeleteBtn = document.getElementById('open-modal-delete');
const closeDeleteBtn = document.getElementById('close-modal-delete');
const cancelDeleteBtn = document.getElementById('cancel-delete');
const confirmDeleteBtn = document.getElementById('confirm-delete');

openDeleteBtn?.addEventListener('click', () => modalDelete.showModal());
closeDeleteBtn?.addEventListener('click', () => modalDelete.close());
cancelDeleteBtn?.addEventListener('click', () => modalDelete.close());
setupBackdropClose(modalDelete);

confirmDeleteBtn?.addEventListener('click', () => {
    console.log('Aluguel excluído com sucesso');
    modalDelete.close();
});

//modal-return

const modalReturn = document.getElementById('modal-return');
const openReturnBtn = document.getElementById('open-modal-return');
const closeReturnBtn = document.getElementById('close-modal-return');
const cancelReturnBtn = document.getElementById('cancel-return');
const confirmReturnBtn = document.getElementById('confirm-return');
const returnDateInput = document.getElementById('return-date');

openReturnBtn?.addEventListener('click', () => {
    if (returnDateInput) {
        returnDateInput.value = new Date().toISOString().split('T')[0];
    }
    modalReturn.showModal();
});

closeReturnBtn?.addEventListener('click', () => modalReturn.close());
cancelReturnBtn?.addEventListener('click', () => modalReturn.close());
setupBackdropClose(modalReturn);

confirmReturnBtn?.addEventListener('click', () => {
    console.log('Devolução confirmada com data:', returnDateInput.value);
    modalReturn.close();
});