const modal = document.getElementById('modal');
const openBtn = document.getElementById('open-modal');
const closeBtn = document.getElementById('close-modal');

// Abre o modal travando o scroll de fundo e ativando o backdrop
openBtn.addEventListener('click', () => {
  modal.showModal();
});

// Fecha o modal
closeBtn.addEventListener('click', () => {
  modal.close();
});

// Fecha ao clicar fora da caixa (no backdrop)
modal.addEventListener('click', (e) => {
  const rect = modal.getBoundingClientRect();
  const clickedInDialog = (
    rect.top <= e.clientY &&
    e.clientY <= rect.top + rect.height &&
    rect.left <= e.clientX &&
    e.clientX <= rect.left + rect.width
  );
  if (!clickedInDialog) {
    modal.close();
  }
});