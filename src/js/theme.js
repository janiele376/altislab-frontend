function aplicarTemaGlobal() {
    let tema = localStorage.getItem('tema');

    if (tema == 'dark') {
        document.documentElement.classList.add('dark-mode');
        if (document.body) {
            document.body.classList.add('dark-mode');
        }
    } else {
        document.documentElement.classList.remove('dark-mode');
        if (document.body) {
            document.body.classList.remove('dark-mode');
        }
    }
}

aplicarTemaGlobal();

document.addEventListener('DOMContentLoaded', function () {
    aplicarTemaGlobal();
});

window.onstorage = function (event) {
    if (event.key == 'tema') {
        aplicarTemaGlobal();
    }
};