let inputEmail = document.querySelector("#input-email")
let inputPassword = document.querySelector("#input-password")
let btnLogin = document.querySelector("#btn-login")
let btnRegister = document.querySelector("#btn-register")
let togglePasswordBtn = document.querySelector("#toggle-password")

const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

togglePassword(inputPassword, togglePasswordBtn, "../imgs/")

btnLogin.addEventListener("click", authentication)

btnRegister.addEventListener("click", function () {
    window.location.href = "./register.html"
})

function authentication() {

    if (
        inputEmail.value === "" ||
        inputPassword.value === ""
    ) {
        alert("Preencha todos os campos!")
        return
    }

    if (
        inputEmail.value === "admin@admin.com" &&
        inputPassword.value === "12345678"
    ) {
        window.location.href = "./admin/dashboard-admin.html"
        return
    }

    const userExists = usuarios.find(function (user) {
        return inputEmail.value === user.email &&
            inputPassword.value === user.password
    })

    if (userExists) {
        localStorage.setItem("userLoggedId", userExists.id)
        window.location.href = "./tenant/dashboard-tenant.html"
    }
    else {
        alert("E-mail ou senha incorretos!")
    }
}