const btnRegister = document.querySelector('button[name="btn-register"]');
const btnCancel = document.querySelector('button[name="btn-cancel"]');

const inputNome = document.querySelector('input[name="nome-completo"]');
const inputDataNasc = document.querySelector('input[name="data-nascimento"]');
const inputEmail = document.querySelector('input[name="email"]');
const inputCpf = document.querySelector('input[name="cpf"]');
const inputTelefone = document.querySelector('input[name="telefone"]');
const inputLocalizacao = document.querySelector('input[name="localizacao"]');
const inputSenha = document.querySelector('input[name="senha"]');
const inputConfirmarSenha = document.querySelector('input[name="confirmar-senha"]');

btnRegister.addEventListener('click', (e) => {
    e.preventDefault();

    const nome = inputNome.value.trim();
    const dataNasc = inputDataNasc.value;
    const email = inputEmail.value.trim().toLowerCase();
    const cpf = inputCpf.value.trim();
    const telefone = inputTelefone.value.trim();
    const localizacao = inputLocalizacao.value.trim();
    const senha = inputSenha.value.trim();
    const confirmarSenha = inputConfirmarSenha.value.trim();

    if (!nome || !dataNasc || !email || !cpf || !telefone || !localizacao || !senha || !confirmarSenha) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    if (senha !== confirmarSenha) {
        alert('As senhas não coincidem!');
        return;
    }

    if (senha.length < 6) {
        alert('A senha deve conter no mínimo 6 caracteres!');
        return;
    }

    const novoLocatario = {
        nome,
        dataNasc,
        email,
        cpf,
        telefone,
        localizacao,
        senha,
        tipo: 'locatario',
        status: 'Ativo'
    };

    const usuarios = JSON.parse(localStorage.getItem('usuarios_biblioteca')) || [];
    usuarios.push(novoLocatario);
    localStorage.setItem('usuarios_biblioteca', JSON.stringify(usuarios));

    alert('Cadastro realizado com sucesso!');
    window.location.href = './login.html';
});

btnCancel.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = './login.html';
});