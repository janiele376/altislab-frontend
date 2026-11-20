const publishers = JSON.parse(localStorage.getItem("publishers")) || []

let publishersList = document.querySelector("#publishers-list")

let btnOpenModal = document.querySelector("#open-modal-create")
let btnCloseModal = document.querySelector("#close-modal-create")
let btnSavePublisher = document.querySelector("#btn-save-publisher")
let btnCancel = document.querySelector("#cancel-create")

let modalCreate = document.querySelector("#modal-create")
let modalTitle = document.querySelector("#modal-publisher-title")

let inputName = document.querySelector("#publisher-name")
let inputCnpj = document.querySelector("#publisher-cnpj")
let inputEmail = document.querySelector("#publisher-email")
let inputPhone = document.querySelector("#publisher-phone")
let inputAddress = document.querySelector("#publisher-address")

let inputSearch = document.querySelector("#input-search")
let btnSearch = document.querySelector("#btn-search")

let btnPrev = document.querySelector("#btn-prev")
let btnNext = document.querySelector("#btn-next")
let currentPageText = document.querySelector("#current-page")
let totalPagesText = document.querySelector("#total-pages")

let currentPage = 1
let itemsPerPage = 5
let editingPublisherId = null

showPublishers(publishers)

btnOpenModal.addEventListener("click", function () {
    editingPublisherId = null
    modalTitle.textContent = "Criar Editora"
    clearInputs()
    modalCreate.showModal()
})

btnCloseModal.addEventListener("click", function () {
    modalCreate.close()
})

btnCancel.addEventListener("click", function () {
    clearInputs()
})

btnSavePublisher.addEventListener("click", function () {

    if (
        inputName.value === "" ||
        inputCnpj.value === "" ||
        inputEmail.value === "" ||
        inputPhone.value === "" ||
        inputAddress.value === ""
    ) {
        alert("Preencha todos os campos!")
        return
    }

    if (editingPublisherId === null) {
        createPublisher()
    }
    else {
        editPublisher()
    }
})

btnSearch.addEventListener("click", function () {
    currentPage = 1
    searchPublishers()
})

inputSearch.addEventListener("input", function () {
    currentPage = 1
    searchPublishers()
})

btnPrev.addEventListener("click", function () {

    if (currentPage > 1) {
        currentPage--
        searchPublishers()
    }
})

btnNext.addEventListener("click", function () {

    const filteredPublishers = filterPublishers()
    const totalPages = Math.ceil(filteredPublishers.length / itemsPerPage)

    if (currentPage < totalPages) {
        currentPage++
        searchPublishers()
    }
})

function createPublisher() {

    const publisherExists = publishers.find(function (publisher) {
        return publisher.cnpj === inputCnpj.value ||
            publisher.email === inputEmail.value
    })

    if (publisherExists) {
        alert("Já existe uma editora com esse CNPJ ou e-mail!")
        return
    }

    const publisher = {
        id: Date.now(),
        name: inputName.value,
        cnpj: inputCnpj.value,
        email: inputEmail.value,
        phone: inputPhone.value,
        address: inputAddress.value
    }

    publishers.push(publisher)

    savePublishers()

    clearInputs()

    modalCreate.close()

    currentPage = 1

    showPublishers(publishers)
}

function showPublishers(publisherList) {

    publishersList.innerHTML = ""

    let totalPages = Math.ceil(publisherList.length / itemsPerPage)

    if (totalPages === 0) {
        totalPages = 1
    }

    if (currentPage > totalPages) {
        currentPage = totalPages
    }

    let start = (currentPage - 1) * itemsPerPage
    let end = start + itemsPerPage

    const publishersPage = publisherList.slice(start, end)

    publishersPage.forEach(function (publisher) {

        let publisherRow = document.createElement("div")
        publisherRow.classList.add("container-table")

        let id = document.createElement("p")
        id.textContent = publisher.id

        let name = document.createElement("p")
        name.textContent = publisher.name

        let contact = document.createElement("div")

        let email = document.createElement("p")
        email.textContent = publisher.email

        let phone = document.createElement("p")
        phone.textContent = publisher.phone

        contact.appendChild(email)
        contact.appendChild(phone)

        let address = document.createElement("p")
        address.textContent = publisher.address

        let actions = document.createElement("div")
        actions.classList.add("container-btns")

        let btnEdit = document.createElement("button")
        btnEdit.textContent = "Editar"
        btnEdit.classList.add("btn-edit")

        btnEdit.addEventListener("click", function () {
            openEditPublisher(publisher.id)
        })

        actions.appendChild(btnEdit)

        publisherRow.appendChild(id)
        publisherRow.appendChild(name)
        publisherRow.appendChild(contact)
        publisherRow.appendChild(address)
        publisherRow.appendChild(actions)

        publishersList.appendChild(publisherRow)
    })

    currentPageText.textContent = currentPage
    totalPagesText.textContent = totalPages
}

function openEditPublisher(id) {

    const publisher = publishers.find(function (publisher) {
        return publisher.id === id
    })

    if (!publisher) {
        return
    }

    editingPublisherId = publisher.id

    inputName.value = publisher.name
    inputCnpj.value = publisher.cnpj
    inputEmail.value = publisher.email
    inputPhone.value = publisher.phone
    inputAddress.value = publisher.address

    modalTitle.textContent = "Editar Editora"

    modalCreate.showModal()
}

function editPublisher() {

    const publisher = publishers.find(function (publisher) {
        return publisher.id === editingPublisherId
    })

    if (!publisher) {
        return
    }

    const publisherExists = publishers.find(function (otherPublisher) {
        return (
            otherPublisher.cnpj === inputCnpj.value ||
            otherPublisher.email === inputEmail.value
        ) && otherPublisher.id !== editingPublisherId
    })

    if (publisherExists) {
        alert("Já existe outra editora com esse CNPJ ou e-mail!")
        return
    }

    publisher.name = inputName.value
    publisher.cnpj = inputCnpj.value
    publisher.email = inputEmail.value
    publisher.phone = inputPhone.value
    publisher.address = inputAddress.value

    savePublishers()

    editingPublisherId = null

    clearInputs()

    modalCreate.close()

    searchPublishers()
}

function searchPublishers() {

    const filteredPublishers = filterPublishers()

    showPublishers(filteredPublishers)
}

function filterPublishers() {

    let search = inputSearch.value.toLowerCase()

    return publishers.filter(function (publisher) {
        return publisher.name.toLowerCase().includes(search) ||
            publisher.cnpj.toLowerCase().includes(search) ||
            publisher.email.toLowerCase().includes(search) ||
            publisher.phone.toLowerCase().includes(search) ||
            publisher.address.toLowerCase().includes(search)
    })
}

function clearInputs() {
    inputName.value = ""
    inputCnpj.value = ""
    inputEmail.value = ""
    inputPhone.value = ""
    inputAddress.value = ""
}

function savePublishers() {
    localStorage.setItem("publishers", JSON.stringify(publishers))
}