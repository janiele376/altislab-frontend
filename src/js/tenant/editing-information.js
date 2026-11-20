const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
const userLoggedId = Number(localStorage.getItem("userLoggedId"))

let profileName = document.querySelector("#profile-name")

let inputEmail = document.querySelector("#input-email")
let inputPhone = document.querySelector("#input-telefone")
let inputBirth = document.querySelector("#input-data-nasc")
let inputCpf = document.querySelector("#input-cpf")
let inputLocal = document.querySelector("#input-localizacao")

let profilePhoto = document.querySelector("#edit-profile-img")
let btnChangePhoto = document.querySelector("#btn-change-photo")
let inputPhoto = document.querySelector("#input-edit-photo")

let inputCurrentPassword = document.querySelector("#input-current-password")
let inputNewPassword = document.querySelector("#input-new-password")
let inputConfirmPassword = document.querySelector("#input-confirm-password")

let toggleCurrentPassword = document.querySelector("#toggle-current-password")
let toggleNewPassword = document.querySelector("#toggle-new-password")
let toggleConfirmPassword = document.querySelector("#toggle-confirm-password")

let btnSave = document.querySelector("#btn-save-changes")

let supportModal = document.querySelector("#supportModal")
let openModalBtn = document.querySelector("#openModalBtn")
let closeModalBtn = document.querySelector("#closeModalBtn")

let newPhoto = null

const userLogged = usuarios.find(function (user) {
    return user.id === userLoggedId
})

if (!userLogged) {
    window.location.href = "../index.html"
}
else {
    loadUser()
}

function loadUser() {
    profileName.textContent = userLogged.name

    inputEmail.value = userLogged.email
    inputPhone.value = userLogged.phone
    inputBirth.value = userLogged.dateBirth
    inputCpf.value = userLogged.cpf
    inputLocal.value = userLogged.local

    if (userLogged.photoProfile) {
        profilePhoto.src = userLogged.photoProfile
    }
    else {
        profilePhoto.src = "../../imgs/user.svg"
    }
}

togglePassword(inputCurrentPassword, toggleCurrentPassword, "../../imgs/")
togglePassword(inputNewPassword, toggleNewPassword, "../../imgs/")
togglePassword(inputConfirmPassword, toggleConfirmPassword, "../../imgs/")

btnChangePhoto.addEventListener("click", function () {
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
        newPhoto = reader.result
        profilePhoto.src = reader.result
    }
})

btnSave.addEventListener("click", function () {

    if (
        inputEmail.value === "" ||
        inputPhone.value === "" ||
        inputLocal.value === ""
    ) {
        alert("Preencha todos os campos!")
        return
    }

    if (inputCurrentPassword.value === "") {
        alert("Digite sua senha atual para confirmar as alterações!")
        return
    }

    if (inputCurrentPassword.value !== userLogged.password) {
        alert("Senha atual incorreta!")
        return
    }

    const emailExists = usuarios.find(function (user) {
        return user.email === inputEmail.value &&
            user.id !== userLoggedId
    })

    if (emailExists) {
        alert("Este e-mail já está sendo utilizado!")
        return
    }

    const wantsChangePassword =
        inputNewPassword.value !== "" ||
        inputConfirmPassword.value !== ""

    if (wantsChangePassword) {

        if (
            inputNewPassword.value === "" ||
            inputConfirmPassword.value === ""
        ) {
            alert("Preencha a nova senha e a confirmação!")
            return
        }

        if (inputNewPassword.value !== inputConfirmPassword.value) {
            alert("As novas senhas estão diferentes!")
            return
        }

        if (inputNewPassword.value === userLogged.password) {
            alert("A nova senha não pode ser igual à senha atual!")
            return
        }

        userLogged.password = inputNewPassword.value
    }

    userLogged.email = inputEmail.value
    userLogged.phone = inputPhone.value
    userLogged.local = inputLocal.value

    if (newPhoto !== null) {
        userLogged.photoProfile = newPhoto
    }

    saveUsers()

    alert("Informações atualizadas com sucesso!")

    window.location.href = "./settings-profile.html"
})

function saveUsers() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
}

openModalBtn.addEventListener("click", function () {
    supportModal.showModal()
})

closeModalBtn.addEventListener("click", function () {
    supportModal.close()
})