const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
const userLoggedId = Number(localStorage.getItem("userLoggedId"))

let profilePhoto = document.querySelector(".img-user")
let profileName = document.querySelector("#profile-name")
let profileEmail = document.querySelector("#profile-email")
let profilePhone = document.querySelector("#profile-phone")
let profileBirth = document.querySelector("#profile-birth")
let profileCpf = document.querySelector("#profile-cpf")
let profileAddress = document.querySelector("#profile-address")

const userLogged = usuarios.find(function (user) {
    return user.id === userLoggedId
})

if (!userLogged) {
    window.location.href = "../index.html"
}
else {
    showProfile()
}

function showProfile() {

    profileName.textContent = userLogged.name

    profileEmail.innerHTML =
        '<span data-translation="label_email">E-mail: </span> ' +
        userLogged.email

    profilePhone.innerHTML =
        '<span data-translation="label_phone">Telefone: </span> ' +
        userLogged.phone

    profileBirth.innerHTML =
        '<span data-translation="label_birth_date">Data de Nascimento: </span> ' +
        userLogged.dateBirth

    profileCpf.innerHTML =
        '<span data-translation="label_cpf">CPF: </span> ' +
        userLogged.cpf

    profileAddress.innerHTML =
        '<span data-translation="label_address">Endereço: </span> ' +
        userLogged.local

    if (userLogged.photoProfile) {
        profilePhoto.src = userLogged.photoProfile
    }
    else {
        profilePhoto.src = "../../imgs/user.svg"
    }
}