const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []

let usersList = document.querySelector("#users-list")

let inputSearch = document.querySelector("#input-search")
let btnSearch = document.querySelector("#btn-search")

let btnPrev = document.querySelector("#btn-prev")
let btnNext = document.querySelector("#btn-next")
let currentPageText = document.querySelector("#current-page")
let totalPagesText = document.querySelector("#total-pages")

let modalEditUser = document.querySelector("#modal-edit-user")
let btnCloseEdit = document.querySelector("#close-edit-user")
let btnCancelEdit = document.querySelector("#cancel-edit-user")
let btnSaveEdit = document.querySelector("#save-edit-user")

let inputName = document.querySelector("#edit-name")
let inputEmail = document.querySelector("#edit-email")
let inputPhone = document.querySelector("#edit-phone")
let inputCpf = document.querySelector("#edit-cpf")
let inputBirth = document.querySelector("#edit-birth")
let inputAddress = document.querySelector("#edit-address")

let currentPage = 1
let itemsPerPage = 5
let editingUserId = null

showUsers(usuarios)

btnSearch.addEventListener("click", function () {
    currentPage = 1
    searchUsers()
})

inputSearch.addEventListener("input", function () {
    currentPage = 1
    searchUsers()
})

btnPrev.addEventListener("click", function () {

    if (currentPage > 1) {
        currentPage--
        searchUsers()
    }
})

btnNext.addEventListener("click", function () {

    const filteredUsers = filterUsers()
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)

    if (currentPage < totalPages) {
        currentPage++
        searchUsers()
    }
})

btnCloseEdit.addEventListener("click", function () {
    modalEditUser.close()
})

btnCancelEdit.addEventListener("click", function () {
    modalEditUser.close()
})

btnSaveEdit.addEventListener("click", function () {

    if (
        inputName.value === "" ||
        inputEmail.value === "" ||
        inputPhone.value === "" ||
        inputCpf.value === "" ||
        inputBirth.value === "" ||
        inputAddress.value === ""
    ) {
        alert("Preencha todos os campos!")
        return
    }

    editUser()
})

function showUsers(userList) {

    usersList.innerHTML = ""

    let totalPages = Math.ceil(userList.length / itemsPerPage)

    if (totalPages === 0) {
        totalPages = 1
    }

    if (currentPage > totalPages) {
        currentPage = totalPages
    }

    let start = (currentPage - 1) * itemsPerPage
    let end = start + itemsPerPage

    const usersPage = userList.slice(start, end)

    usersPage.forEach(function (user) {

        let userRow = document.createElement("div")
        userRow.classList.add("container-table")

        let name = document.createElement("p")
        name.textContent = user.name

        let cpf = document.createElement("p")
        cpf.textContent = user.cpf

        let birth = document.createElement("p")
        birth.textContent = user.dateBirth

        let address = document.createElement("p")
        address.textContent = user.local

        let actions = document.createElement("div")
        actions.classList.add("container-btns")

        let btnEdit = document.createElement("button")
        btnEdit.textContent = "Editar"
        btnEdit.classList.add("btn-edit-user")

        btnEdit.addEventListener("click", function () {
            openEditUser(user.id)
        })

        actions.appendChild(btnEdit)

        userRow.appendChild(name)
        userRow.appendChild(cpf)
        userRow.appendChild(birth)
        userRow.appendChild(address)
        userRow.appendChild(actions)

        usersList.appendChild(userRow)
    })

    currentPageText.textContent = currentPage
    totalPagesText.textContent = totalPages
}

function openEditUser(id) {

    const user = usuarios.find(function (user) {
        return user.id === id
    })

    if (!user) {
        return
    }

    editingUserId = user.id

    inputName.value = user.name
    inputEmail.value = user.email
    inputPhone.value = user.phone
    inputCpf.value = user.cpf
    inputBirth.value = user.dateBirth
    inputAddress.value = user.local

    modalEditUser.showModal()
}

function editUser() {

    const user = usuarios.find(function (user) {
        return user.id === editingUserId
    })

    if (!user) {
        return
    }

    const userExists = usuarios.find(function (otherUser) {
        return (
            otherUser.email === inputEmail.value ||
            otherUser.cpf === inputCpf.value
        ) && otherUser.id !== editingUserId
    })

    if (userExists) {
        alert("Já existe outro usuário com esse CPF ou e-mail!")
        return
    }

    user.name = inputName.value
    user.email = inputEmail.value
    user.phone = inputPhone.value
    user.cpf = inputCpf.value
    user.dateBirth = inputBirth.value
    user.local = inputAddress.value

    saveUsers()

    editingUserId = null

    modalEditUser.close()

    searchUsers()
}

function searchUsers() {
    const filteredUsers = filterUsers()
    showUsers(filteredUsers)
}

function filterUsers() {

    let search = inputSearch.value.toLowerCase()

    return usuarios.filter(function (user) {
        return user.name.toLowerCase().includes(search) ||
            user.cpf.toLowerCase().includes(search) ||
            user.email.toLowerCase().includes(search) ||
            user.phone.toLowerCase().includes(search) ||
            user.local.toLowerCase().includes(search)
    })
}

function saveUsers() {
    localStorage.setItem("usuarios", JSON.stringify(usuarios))
}