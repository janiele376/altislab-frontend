document.addEventListener('DOMContentLoaded', () => {
    const btnLight = document.querySelector('.btn-light');
    const btnDark = document.querySelector('.btn-dark');
    const selectLanguage = document.querySelector('.select-language');

    const temaSalvo = localStorage.getItem('app_theme') || 'light';
    const idiomaSalvo = localStorage.getItem('app_lang') || 'Português - Brasil';

    function aplicarTema(tema) {
        if (tema === 'dark') {
            document.body.classList.add('dark-theme');
            btnDark?.classList.add('active-theme');
            btnLight?.classList.remove('active-theme');
        } else {
            document.body.classList.remove('dark-theme');
            btnLight?.classList.add('active-theme');
            btnDark?.classList.remove('active-theme');
        }
        localStorage.setItem('app_theme', tema);
    }

    aplicarTema(temaSalvo);

    if (selectLanguage) {
        selectLanguage.value = idiomaSalvo;
    }

    btnLight?.addEventListener('click', (e) => {
        e.preventDefault();
        aplicarTema('light');
    });

    btnDark?.addEventListener('click', (e) => {
        e.preventDefault();
        aplicarTema('dark');
    });

    selectLanguage?.addEventListener('change', (e) => {
        const idiomaSelecionado = e.target.value;
        if (idiomaSelecionado !== 'Selecione') {
            localStorage.setItem('app_lang', idiomaSelecionado);
            alert(`Idioma alterado para: ${idiomaSelecionado}`);
        }
    });
});