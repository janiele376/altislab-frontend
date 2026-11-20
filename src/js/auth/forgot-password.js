const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

let btnSend = document.querySelector(".btn-send")
let btnCancel = document.querySelector(".btn-cancel")

let inputEmail = document.querySelector("#input-email")
let inputCpf = document.querySelector("#input-cpf")
let inputNovaSenha = document.querySelector("#input-password")
let inputConfirmarNovaSenha = document.querySelector("#input-new-password")

let toggleNovaSenha = document.querySelector("#toggle-password")
let toggleConfirmarNovaSenha = document.querySelector("#toggle-new-password")

togglePassword(inputNovaSenha, toggleNovaSenha, "../imgs/")
togglePassword(inputConfirmarNovaSenha, toggleConfirmarNovaSenha, "../imgs/")

btnSend.addEventListener("click", function () {

    if (
        inputEmail.value === "" ||
        inputCpf.value === "" ||
        inputNovaSenha.value === "" ||
        inputConfirmarNovaSenha.value === ""
    ) {
        alert("Todos os campos devem estar preenchidos!")
        return
    }

    const userExists = findUser(
        usuarios,
        inputEmail.value,
        inputCpf.value
    )

    if (!userExists) {
        alert("Usuário não encontrado!")
        return
    }

    if (inputNovaSenha.value === userExists.password) {
        alert("A senha nova não pode ser igual à atual!")
        return
    }

    if (inputNovaSenha.value !== inputConfirmarNovaSenha.value) {
        alert("As senhas estão diferentes!")
        return
    }

    newPassword(userExists)

    alert("Nova senha cadastrada com sucesso!")

    window.location.href = "../pages/index.html"
})

btnCancel.addEventListener("click", function () {
    inputEmail.value = ""
    inputCpf.value = ""
    inputNovaSenha.value = ""
    inputConfirmarNovaSenha.value = ""
})

function findUser(users, email, cpf) {

    return users.find(function (user) {
        return user.email === email && user.cpf === cpf
    })
}

function newPassword(user) {
    user.password = inputNovaSenha.value
    saveUser()
}

function saveUser() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
}