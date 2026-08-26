document.addEventListener('DOMContentLoaded', () => {
    const inputEmail = document.getElementById('input-email');
    const inputPassword = document.getElementById('input-password');
    const btnLogin = document.getElementById('btn-login');
    const togglePassword = document.getElementById('toggle-password');

    togglePassword?.addEventListener('click', () => {
        const isPassword = inputPassword.type === 'password';
        
        inputPassword.type = isPassword ? 'text' : 'password';
        
        togglePassword.src = isPassword ? '../imgs/visibility.svg' : '../imgs/visibility_off.svg';
        togglePassword.alt = isPassword ? 'Ocultar senha' : 'Mostrar senha';
    });

    // Ação de Logi
    btnLogin?.addEventListener('click', (e) => {
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

        alert('E-mail ou senha incorretos!');
    });
});