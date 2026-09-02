function aplicarTemaGlobal() {
    const tema = localStorage.getItem('tema');
    const deveSerEscuro = tema === 'dark';

    document.documentElement.classList.toggle('dark-mode', deveSerEscuro);

    if (document.body) {
        document.body.classList.toggle('dark-mode', deveSerEscuro);
    }
}

aplicarTemaGlobal();

document.addEventListener('DOMContentLoaded', aplicarTemaGlobal);

window.addEventListener('storage', (event) => {
    if (event.key === 'tema') {
        aplicarTemaGlobal();
    }
});