let btnLight = document.getElementById('btn-light');
let btnDark = document.getElementById('btn-dark');
let selectLanguage = document.getElementById('select-language');

function aplicarTema(tema) {
    if (tema == 'dark') {
        document.body.classList.add('dark-mode');
        if (btnDark) {
            btnDark.classList.add('active');
        }
        if (btnLight) {
            btnLight.classList.remove('active');
        }
    } else {
        document.body.classList.remove('dark-mode');
        if (btnLight) {
            btnLight.classList.add('active');
        }
        if (btnDark) {
            btnDark.classList.remove('active');
        }
    }
}

let temaSalvo = localStorage.getItem('tema');
if (!temaSalvo) {
    temaSalvo = 'light';
}
aplicarTema(temaSalvo);

let idiomaSalvo = localStorage.getItem('idioma_sistema');
if (idiomaSalvo) {
    if (selectLanguage) {
        selectLanguage.value = idiomaSalvo;
    }
}

if (btnLight) {
    btnLight.onclick = function () {
        aplicarTema('light');
        localStorage.setItem('tema', 'light');
    };
}

if (btnDark) {
    btnDark.onclick = function () {
        aplicarTema('dark');
        localStorage.setItem('tema', 'dark');
    };
}

if (selectLanguage) {
    selectLanguage.onchange = function () {
        let idioma = selectLanguage.value;
        if (idioma != 'Selecione') {
            localStorage.setItem('idioma_sistema', idioma);
            alert('Idioma alterado para: ' + idioma);
        }
    };
}