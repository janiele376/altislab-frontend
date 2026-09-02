document.addEventListener('DOMContentLoaded', function() {
    const inputEmail = document.getElementById('input-email');
    const inputPassword = document.getElementById('input-password');
    const btnLogin = document.getElementById('btn-login');
    const btnRegister = document.getElementById('btn-register');
    const togglePassword = document.getElementById('toggle-password');

    togglePassword?.addEventListener('click', function(e) {
            e.preventDefault();
            if (inputPassword.type === 'password') {
                inputPassword.type = 'text';
                togglePassword.src = '../imgs/visibility.svg';
                togglePassword.alt = 'Ocultar senha';
            } else {
                inputPassword.type = 'password';
                togglePassword.src = '../imgs/visibility_off.svg';
                togglePassword.alt = 'Mostrar senha';
            }
        });

    btnLogin?.addEventListener('click', function(e){
        e.preventDefault();

        const email = inputEmail.value.trim().toLowerCase();
        const senha = inputPassword.value.trim();

        if (!email || !senha) {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (email === 'admin@admin.com' && senha === '12345678') {
            window.location.href = './admin/dashboard-admin.html';
            return;
        }

        if (email === 'user@user.com' && senha === '12345678') {
            window.location.href = './tenant/dashboard-tenant.html';
            return;
        }

        const usuarios = JSON.parse(localStorage.getItem('usuarios_biblioteca')) || [];

        const usuarioEncontrado = usuarios.find(
            usuario => usuario.email === email && usuario.senha === senha
        );

        if (usuarioEncontrado) {
            localStorage.setItem('usuario_logado', JSON.stringify(usuarioEncontrado));
            
            window.location.href = './tenant/dashboard-tenant.html';
            return;
        }

        alert('E-mail ou senha incorretos!');
    });

    function openRegister(e){
        e?.preventDefault();
        window.location.href = './register.html';
        return;
    }

    btnRegister?.addEventListener('click', openRegister);
});