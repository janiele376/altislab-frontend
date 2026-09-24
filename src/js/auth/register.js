const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

let nameCompleted = document.querySelector("#input-name")
let email = document.querySelector("#input-email")
let dateBirth = document.querySelector("#input-birth")
let cpf = document.querySelector("#input-cpf")
let phone = document.querySelector("#input-phone")
let local = document.querySelector("#input-local")
let password = document.querySelector("#input-password")
let confirmPassword = document.querySelector("#input-confirm-password")

let togglePasswordBtn = document.querySelector("#toggle-password")
let toggleConfirmPassword = document.querySelector("#toggle-confirm-password")

let confirmRegister = document.querySelector("#btn-register")
let cancel = document.querySelector("#btn-cancel")

let modalPhoto = document.querySelector("#modal-photo")
let saveRegister = document.querySelector("#btn-confirm-photo")
let skipPhoto = document.querySelector("#btn-skip-photo")
let choosePhoto = document.querySelector("#btn-choose-gallery")
let inputPhoto = document.querySelector("#input-file-photo")
let previewPhoto = document.querySelector("#preview-photo")

let photoProfile = null

togglePassword(password, togglePasswordBtn, "../imgs/")
togglePassword(confirmPassword, toggleConfirmPassword, "../imgs/")

confirmRegister.addEventListener("click", openModal)

cancel.addEventListener("click", function () {
    nameCompleted.value = ""
    email.value = ""
    dateBirth.value = ""
    cpf.value = ""
    phone.value = ""
    local.value = ""
    password.value = ""
    confirmPassword.value = ""
})

function openModal() {

    if (
        nameCompleted.value === "" ||
        email.value === "" ||
        dateBirth.value === "" ||
        cpf.value === "" ||
        phone.value === "" ||
        local.value === "" ||
        password.value === "" ||
        confirmPassword.value === ""
    ) {
        alert("Preencha todos os campos!")
        return
    }

    const userExists = findUser(usuarios, email.value, cpf.value)

    if (userExists) {
        alert("Usuário já cadastrado com o CPF ou e-mail informado!")
        return
    }

    if (password.value !== confirmPassword.value) {
        alert("Senhas diferentes!")
        return
    }

    modalPhoto.showModal()
}

function findUser(users, email, cpf) {

    return users.find(function (user) {
        return user.email === email || user.cpf === cpf
    })
}

choosePhoto.addEventListener("click", function () {
    inputPhoto.click()
})

inputPhoto.addEventListener("change", function () {

    const photo = inputPhoto.files[0]

    if (!photo) {
        return
    }

    const reader = new FileReader()

    reader.readAsDataURL(photo)

    reader.onload = function () {
        photoProfile = reader.result
        previewPhoto.src = reader.result
    }
})

saveRegister.addEventListener("click", function () {

    if (photoProfile === null) {
        alert("Escolha uma foto ou clique em PULAR.")
        return
    }

    createUser()
})

skipPhoto.addEventListener("click", function () {
    photoProfile = null
    createUser()
})

function createUser() {

    const user = {
        id: Date.now(),
        name: nameCompleted.value,
        email: email.value,
        dateBirth: dateBirth.value,
        cpf: cpf.value,
        phone: phone.value,
        local: local.value,
        password: password.value,
        photoProfile: photoProfile
    }

    usuarios.push(user)

    saveUser()

    localStorage.setItem("userLoggedId", user.id)

    modalPhoto.close()

    window.location.href = "./tenant/dashboard-tenant.html"
}

function saveUser() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
}