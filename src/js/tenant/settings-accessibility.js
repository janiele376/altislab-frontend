document.addEventListener('DOMContentLoaded', () => {
    const btnLight = document.getElementById('btn-light');
    const btnDark = document.getElementById('btn-dark');
    const selectLanguage = document.getElementById('select-language');

    function aplicarTema(tema) {
        if (tema === 'dark') {
            document.body.classList.add('dark-mode');
            btnDark?.classList.add('active');
            btnLight?.classList.remove('active');
        } else {
            document.body.classList.remove('dark-mode');
            btnLight?.classList.add('active');
            btnDark?.classList.remove('active');
        }
    }

    const temaSalvo = localStorage.getItem('tema') || 'light';
    aplicarTema(temaSalvo);

    const idiomaSalvo = localStorage.getItem('idioma_sistema');
    if (idiomaSalvo && selectLanguage) {
        selectLanguage.value = idiomaSalvo;
    }

    btnLight?.addEventListener('click', () => {
        aplicarTema('light');
        localStorage.setItem('tema', 'light');
    });

    btnDark?.addEventListener('click', () => {
        aplicarTema('dark');
        localStorage.setItem('tema', 'dark');
    });

    selectLanguage?.addEventListener('change', (e) => {
        const idioma = e.target.value;
        if (idioma !== 'Selecione') {
            localStorage.setItem('idioma_sistema', idioma);
            alert(`Idioma alterado para: ${idioma}`);
        }
    });
});