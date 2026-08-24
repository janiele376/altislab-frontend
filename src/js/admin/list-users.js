const modalStatus = document.getElementById('modal-status');
const closeBtnStatus = document.getElementById('close-modal-status');
const cancelBtnStatus = document.getElementById('cancel-status');
const confirmBtnStatus = document.getElementById('confirm-status');

const userNameEl = document.getElementById('status-user-name');
const userCpfEl = document.getElementById('status-user-cpf');

function abrirModalStatus(nome, cpf) {
    if (userNameEl && userCpfEl) {
        userNameEl.textContent = nome;
        userCpfEl.textContent = cpf;
    }
    modalStatus.showModal();
}

[closeBtnStatus, cancelBtnStatus].forEach(btn => {
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
    console.log(`Status alterado com sucesso para: ${userNameEl.textContent}`);
    modalStatus.close();
});