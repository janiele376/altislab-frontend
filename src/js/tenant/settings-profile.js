document.addEventListener('DOMContentLoaded', () => {
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profilePhone = document.getElementById('profile-phone');
    const profileBirth = document.getElementById('profile-birth');
    const profileCpf = document.getElementById('profile-cpf');
    const profileAddress = document.getElementById('profile-address');

    const usuarios = JSON.parse(localStorage.getItem('usuarios_biblioteca')) || [];

    if (usuarios.length > 0) {
        const usuarioAtual = usuarios[usuarios.length - 1];

        if (profileName) profileName.textContent = usuarioAtual.nome || 'Maria Silva';
        if (profileEmail) profileEmail.textContent = usuarioAtual.email || 'maria.silva@email.com';
        if (profilePhone) profilePhone.textContent = usuarioAtual.telefone || '(99) 99999-9999';
        if (profileBirth) profileBirth.textContent = usuarioAtual.dataNasc || '01/01/2000';
        if (profileCpf) profileCpf.textContent = usuarioAtual.cpf || '000.000.000-00';
        if (profileAddress) profileAddress.textContent = usuarioAtual.localizacao || 'Rua das Flores, 123 - Centro';
    }
});