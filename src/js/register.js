let inputSenha = document.querySelector('input[name="senha"]');
let inputConfirmarSenha = document.querySelector('input[name="confirmar-senha"]');
let btnToggleSenha = document.getElementById('toggle-password');
let btnToggleConfirmarSenha = document.getElementById('toggle-confirm-password');

if (btnToggleSenha) {
    btnToggleSenha.onclick = function () {
        if (inputSenha.type == 'password') {
            inputSenha.type = 'text';
            btnToggleSenha.src = '../imgs/visibility.svg';
            btnToggleSenha.alt = 'Ocultar senha';
        } else {
            inputSenha.type = 'password';
            btnToggleSenha.src = '../imgs/visibility_off.svg';
            btnToggleSenha.alt = 'Mostrar senha';
        }
    };
}

if (btnToggleConfirmarSenha) {
    btnToggleConfirmarSenha.onclick = function () {
        if (inputConfirmarSenha.type == 'password') {
            inputConfirmarSenha.type = 'text';
            btnToggleConfirmarSenha.src = '../imgs/visibility.svg';
            btnToggleConfirmarSenha.alt = 'Ocultar senha';
        } else {
            inputConfirmarSenha.type = 'password';
            btnToggleConfirmarSenha.src = '../imgs/visibility_off.svg';
            btnToggleConfirmarSenha.alt = 'Mostrar senha';
        }
    };
}

let form = document.querySelector('form');
let btnRegister = document.querySelector('button[name="btn-register"]');
let btnCancel = document.querySelector('button[name="btn-cancel"]');

let modalPhoto = document.getElementById('modal-photo');
let previewPhoto = document.getElementById('preview-photo');
let inputFilePhoto = document.getElementById('input-file-photo');
let btnChooseGallery = document.getElementById('btn-choose-gallery');
let btnConfirmPhoto = document.getElementById('btn-confirm-photo');
let btnSkipPhoto = document.getElementById('btn-skip-photo');

let novoLocatarioTemp = null;
let fotoBase64 = '../../imgs/user.svg';

function salvarUsuarioFinal(usuario) {
    let lista1 = JSON.parse(localStorage.getItem('@biblioteca:usuarios'));
    if (!lista1) {
        lista1 = [];
    }
    lista1.push(usuario);
    localStorage.setItem('@biblioteca:usuarios', JSON.stringify(lista1));

    let lista2 = JSON.parse(localStorage.getItem('usuarios_biblioteca'));
    if (!lista2) {
        lista2 = [];
    }
    lista2.push(usuario);
    localStorage.setItem('usuarios_biblioteca', JSON.stringify(lista2));

    localStorage.setItem('usuario_logado', JSON.stringify(usuario));

    if (modalPhoto) {
        modalPhoto.close();
    }
    alert('Cadastro realizado com sucesso!');
    window.location.href = './tenant/dashboard-tenant.html';
}

if (btnRegister) {
    btnRegister.onclick = function (e) {
        e.preventDefault();

        if (!form) return;

        let inputNome = document.querySelector('input[name="nome-completo"]');
        let inputNascimento = document.querySelector('input[name="data-nascimento"]');
        let inputEmail = document.querySelector('input[name="email"]');
        let inputCpf = document.querySelector('input[name="cpf"]');
        let inputTelefone = document.querySelector('input[name="telefone"]');
        let inputLocalizacao = document.querySelector('input[name="localizacao"]');

        let nome = inputNome ? inputNome.value.trim() : '';
        let nascimento = inputNascimento ? inputNascimento.value.trim() : '';
        let email = inputEmail ? inputEmail.value.trim().toLowerCase() : '';
        let cpf = inputCpf ? inputCpf.value.trim() : '';
        let telefone = inputTelefone ? inputTelefone.value.trim() : '';
        let localizacao = inputLocalizacao ? inputLocalizacao.value.trim() : '';
        let senha = inputSenha ? inputSenha.value.trim() : '';
        let confirmarSenha = inputConfirmarSenha ? inputConfirmarSenha.value.trim() : '';

        if (nome == '' || nascimento == '' || email == '' || cpf == '' || telefone == '' || localizacao == '' || senha == '' || confirmarSenha == '') {
            alert('Por favor, preencha todos os campos!');
            return;
        }

        if (senha != confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        if (senha.length < 8) {
            alert('A senha deve conter exatamente 8 dígitos!');
            return;
        }

        novoLocatarioTemp = {
            id: String(new Date().getTime()),
            nome: nome,
            nascimento: nascimento,
            dataNasc: nascimento,
            email: email,
            cpf: cpf,
            telefone: telefone,
            endereco: localizacao,
            localizacao: localizacao,
            senha: senha,
            tipo: 'locatario',
            status: 'Ativo',
            foto: '../../imgs/user.svg'
        };

        let usuarios = JSON.parse(localStorage.getItem('@biblioteca:usuarios'));
        if (!usuarios) {
            usuarios = JSON.parse(localStorage.getItem('usuarios_biblioteca'));
        }
        if (!usuarios) {
            usuarios = [];
        }

        let usuarioExiste = false;
        for (let i = 0; i < usuarios.length; i++) {
            let u = usuarios[i];
            let emailCadastrado = (u.email || '').toLowerCase().trim();
            let cpfCadastrado = u.cpf || '';

            if (emailCadastrado == email || cpfCadastrado == cpf) {
                usuarioExiste = true;
                break;
            }
        }

        if (usuarioExiste) {
            alert('Já existe uma conta cadastrada com este E-mail ou CPF!');
            return;
        }

        if (modalPhoto) {
            modalPhoto.showModal();
        } else {
            salvarUsuarioFinal(novoLocatarioTemp);
        }
    };
}

if (btnChooseGallery) {
    btnChooseGallery.onclick = function () {
        if (inputFilePhoto) {
            inputFilePhoto.click();
        }
    };
}

if (inputFilePhoto) {
    inputFilePhoto.onchange = function (e) {
        let arquivo = e.target.files[0];
        if (arquivo) {
            let leitor = new FileReader();
            leitor.onload = function (evt) {
                fotoBase64 = evt.target.result;
                if (previewPhoto) {
                    previewPhoto.src = fotoBase64;
                }
            };
            leitor.readAsDataURL(arquivo);
        }
    };
}

if (btnConfirmPhoto) {
    btnConfirmPhoto.onclick = function () {
        if (!novoLocatarioTemp) return;
        novoLocatarioTemp.foto = fotoBase64;
        salvarUsuarioFinal(novoLocatarioTemp);
    };
}

if (btnSkipPhoto) {
    btnSkipPhoto.onclick = function () {
        if (!novoLocatarioTemp) return;
        novoLocatarioTemp.foto = '../../imgs/user.svg';
        salvarUsuarioFinal(novoLocatarioTemp);
    };
}

if (btnCancel) {
    btnCancel.onclick = function (e) {
        e.preventDefault();
        window.location.href = './login.html';
    };
}