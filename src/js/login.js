const inputEmail = document.getElementById('input-email');
const inputPassword = document.getElementById('input-password');
const btnLogin = document.getElementById('btn-login');

btnLogin.addEventListener('click', (e) => {
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