document.addEventListener('DOMContentLoaded', () => {
    const usuario = JSON.parse(localStorage.getItem('usuario_logado')) 
                 || JSON.parse(localStorage.getItem('usuarios_biblioteca'))?.slice(-1)[0];

    if (!usuario) return;

    const campos = {
        'profile-name': usuario.nome || 'Maria Silva',
        'profile-email': usuario.email || 'maria.silva@email.com',
        'profile-phone': usuario.telefone || '(99) 99999-9999',
        'profile-birth': usuario.dataNasc || '01/01/2000',
        'profile-cpf': usuario.cpf || '000.000.000-00',
        'profile-address': usuario.localizacao || 'Rua das Flores, 123 - Centro'
    };

    Object.entries(campos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) elemento.textContent = valor;
    });
});