const rentals = JSON.parse(localStorage.getItem("rentals")) || []
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
const books = JSON.parse(localStorage.getItem("books")) || []

let rentalsList = document.querySelector("#rentals-list")

let btnOpenModal = document.querySelector("#open-modal")
let btnCloseModal = document.querySelector("#close-modal")
let btnSaveRental = document.querySelector("#btn-save-rental")
let btnCancelCreate = document.querySelector("#cancel-create")
let modal = document.querySelector("#modal")

let inputUserName = document.querySelector("#name-user")
let inputUserCpf = document.querySelector("#cpf-user")
let inputBookName = document.querySelector("#book-name")
let inputBookCod = document.querySelector("#book-cod")

let inputSearch = document.querySelector("#input-search")
let btnSearch = document.querySelector("#btn-search")

let btnFilter = document.querySelector("#btn-filter")
let filterDropdown = document.querySelector("#filter-dropdown")
let filterStatus = document.querySelector("#filter-status")
let filterSort = document.querySelector("#filter-sort")
let btnClearFilter = document.querySelector("#btn-clear-filter")
let btnApplyFilter = document.querySelector("#btn-apply-filter")

let btnPrev = document.querySelector("#btn-prev")
let btnNext = document.querySelector("#btn-next")
let currentPageText = document.querySelector("#current-page")
let totalPagesText = document.querySelector("#total-pages")

let modalRenew = document.querySelector("#modal-renew")
let btnCloseRenew = document.querySelector("#close-modal-renew")
let btnCancelRenew = document.querySelector("#cancel-renew")
let btnConfirmRenew = document.querySelector("#confirm-renew")
let renewUserName = document.querySelector("#renew-user-name")
let renewBookName = document.querySelector("#renew-book-name")
let renewDate = document.querySelector("#renew-date")

let modalReturn = document.querySelector("#modal-return")
let btnCloseReturn = document.querySelector("#close-modal-return")
let btnCancelReturn = document.querySelector("#cancel-return")
let btnConfirmReturn = document.querySelector("#confirm-return")
let returnUserName = document.querySelector("#return-user-name")
let returnBookName = document.querySelector("#return-book-name")
let returnDate = document.querySelector("#return-date")

let currentPage = 1
let itemsPerPage = 5
let selectedRentalId = null

updateRentalStatus()
showRentals(rentals)

btnOpenModal.addEventListener("click", function () {
    clearInputs()
    modal.showModal()
})

btnCloseModal.addEventListener("click", function () {
    modal.close()
})

btnCancelCreate.addEventListener("click", function () {
    clearInputs()
})

btnSaveRental.addEventListener("click", function () {

    if (
        inputUserName.value === "" ||
        inputUserCpf.value === "" ||
        inputBookName.value === "" ||
        inputBookCod.value === ""
    ) {
        alert("Preencha todos os campos!")
        return
    }

    createRental()
})

btnSearch.addEventListener("click", function () {
    currentPage = 1
    showFilteredRentals()
})

inputSearch.addEventListener("input", function () {
    currentPage = 1
    showFilteredRentals()
})

btnFilter.addEventListener("click", function () {
    filterDropdown.classList.toggle("active")
})

btnApplyFilter.addEventListener("click", function () {
    currentPage = 1
    showFilteredRentals()
    filterDropdown.classList.remove("active")
})

btnClearFilter.addEventListener("click", function () {
    filterStatus.value = "todos"
    filterSort.value = "recentes"
    currentPage = 1
    showFilteredRentals()
})

btnPrev.addEventListener("click", function () {

    if (currentPage > 1) {
        currentPage--
        showFilteredRentals()
    }
})

btnNext.addEventListener("click", function () {

    const filteredRentals = filterRentals()
    const totalPages = Math.ceil(filteredRentals.length / itemsPerPage)

    if (currentPage < totalPages) {
        currentPage++
        showFilteredRentals()
    }
})

btnCloseRenew.addEventListener("click", function () {
    modalRenew.close()
})

btnCancelRenew.addEventListener("click", function () {
    modalRenew.close()
})

btnConfirmRenew.addEventListener("click", function () {

    if (renewDate.value === "") {
        alert("Informe a nova data de devolução!")
        return
    }

    renewRental()
})

btnCloseReturn.addEventListener("click", function () {
    modalReturn.close()
})

btnCancelReturn.addEventListener("click", function () {
    modalReturn.close()
})

btnConfirmReturn.addEventListener("click", function () {

    if (returnDate.value === "") {
        alert("Informe a data de devolução!")
        return
    }

    returnRental()
})

function createRental() {

    const user = usuarios.find(function (user) {
        return user.name === inputUserName.value &&
            user.cpf === inputUserCpf.value
    })

    if (!user) {
        alert("Usuário não encontrado!")
        return
    }

    const book = books.find(function (book) {
        return book.name === inputBookName.value &&
            book.cod === inputBookCod.value
    })

    if (!book) {
        alert("Livro não encontrado!")
        return
    }

    if (book.quantity <= 0) {
        alert("Esse livro não está disponível!")
        return
    }

    const lateRental = rentals.find(function (rental) {
        return rental.userId === user.id &&
            rental.status === "Atrasado"
    })

    if (lateRental) {
        alert("Resolva seus livros em atraso para conseguir alugar mais livros!")
        return
    }

    let startDate = new Date()
    let dueDate = new Date()

    dueDate.setDate(dueDate.getDate() + 14)

    const rental = {
        id: Date.now(),
        userId: user.id,
        userName: user.name,
        userCpf: user.cpf,
        bookId: book.id,
        bookName: book.name,
        bookCod: book.cod,
        startDate: formatDate(startDate),
        dueDate: formatDate(dueDate),
        returnDate: null,
        status: "Ativo"
    }

    rentals.push(rental)

    book.quantity = book.quantity - 1

    saveRentals()
    saveBooks()

    clearInputs()

    modal.close()

    currentPage = 1

    showFilteredRentals()
}

function showRentals(rentalList) {

    rentalsList.innerHTML = ""

    let totalPages = Math.ceil(rentalList.length / itemsPerPage)

    if (totalPages === 0) {
        totalPages = 1
    }

    if (currentPage > totalPages) {
        currentPage = totalPages
    }

    let start = (currentPage - 1) * itemsPerPage
    let end = start + itemsPerPage

    const rentalsPage = rentalList.slice(start, end)

    rentalsPage.forEach(function (rental) {

        let rentalRow = document.createElement("div")
        rentalRow.classList.add("rental-row")

        let userName = document.createElement("p")
        userName.textContent = rental.userName

        let bookName = document.createElement("p")
        bookName.textContent = rental.bookName

        let startDate = document.createElement("p")
        startDate.textContent = rental.startDate

        let dueDate = document.createElement("p")
        dueDate.textContent = rental.dueDate

        let status = document.createElement("p")
        status.textContent = rental.status
        status.classList.add("rental-status")

        if (rental.status === "Ativo") {
            status.classList.add("active-status")
        }

        if (rental.status === "Atrasado") {
            status.classList.add("late-status")
        }

        if (rental.status === "Inativo") {
            status.classList.add("inactive-status")
        }

        let actions = document.createElement("div")
        actions.classList.add("rental-actions")

        if (rental.status !== "Inativo") {

            let btnRenew = document.createElement("button")
            btnRenew.textContent = "Renovar"
            btnRenew.classList.add("btn-renew")

            btnRenew.addEventListener("click", function () {
                openRenewModal(rental.id)
            })

            let btnReturn = document.createElement("button")
            btnReturn.textContent = "Devolver"
            btnReturn.classList.add("btn-return")

            btnReturn.addEventListener("click", function () {
                openReturnModal(rental.id)
            })

            actions.appendChild(btnRenew)
            actions.appendChild(btnReturn)
        }

        rentalRow.appendChild(userName)
        rentalRow.appendChild(bookName)
        rentalRow.appendChild(startDate)
        rentalRow.appendChild(dueDate)
        rentalRow.appendChild(status)
        rentalRow.appendChild(actions)

        rentalsList.appendChild(rentalRow)
    })

    currentPageText.textContent = currentPage
    totalPagesText.textContent = totalPages
}

function openRenewModal(id) {

    const rental = rentals.find(function (rental) {
        return rental.id === id
    })

    if (!rental) {
        return
    }

    selectedRentalId = rental.id

    renewUserName.textContent = rental.userName
    renewBookName.textContent = rental.bookName

    let currentDueDate = new Date(rental.dueDate + "T00:00:00")

    currentDueDate.setDate(currentDueDate.getDate() + 14)

    renewDate.value = formatDate(currentDueDate)

    modalRenew.showModal()
}

function renewRental() {

    const rental = rentals.find(function (rental) {
        return rental.id === selectedRentalId
    })

    if (!rental) {
        return
    }

    rental.dueDate = renewDate.value
    rental.status = "Ativo"

    saveRentals()

    selectedRentalId = null

    modalRenew.close()

    showFilteredRentals()
}

function openReturnModal(id) {

    const rental = rentals.find(function (rental) {
        return rental.id === id
    })

    if (!rental) {
        return
    }

    selectedRentalId = rental.id

    returnUserName.textContent = rental.userName
    returnBookName.textContent = rental.bookName

    returnDate.value = formatDate(new Date())

    modalReturn.showModal()
}

function returnRental() {

    const rental = rentals.find(function (rental) {
        return rental.id === selectedRentalId
    })

    if (!rental) {
        return
    }

    const book = books.find(function (book) {
        return book.id === rental.bookId
    })

    rental.returnDate = returnDate.value
    rental.status = "Inativo"

    if (book) {
        book.quantity = book.quantity + 1
    }

    saveRentals()
    saveBooks()

    selectedRentalId = null

    modalReturn.close()

    showFilteredRentals()
}

function updateRentalStatus() {

    let today = formatDate(new Date())

    rentals.forEach(function (rental) {

        if (
            rental.status !== "Inativo" &&
            rental.dueDate < today
        ) {
            rental.status = "Atrasado"
        }
    })

    saveRentals()
}

function filterRentals() {

    let search = inputSearch.value.toLowerCase()

    let filteredRentals = rentals.filter(function (rental) {

        let matchesSearch =
            rental.userName.toLowerCase().includes(search) ||
            rental.bookName.toLowerCase().includes(search)

        let matchesStatus =
            filterStatus.value === "todos" ||
            rental.status === filterStatus.value

        return matchesSearch && matchesStatus
    })

    if (filterSort.value === "nome") {

        filteredRentals.sort(function (a, b) {
            return a.userName.localeCompare(b.userName)
        })
    }

    if (filterSort.value === "vencimento") {

        filteredRentals.sort(function (a, b) {
            return new Date(a.dueDate) - new Date(b.dueDate)
        })
    }

    if (filterSort.value === "recentes") {

        filteredRentals.sort(function (a, b) {
            return b.id - a.id
        })
    }

    return filteredRentals
}

function showFilteredRentals() {
    const filteredRentals = filterRentals()
    showRentals(filteredRentals)
}

function clearInputs() {
    inputUserName.value = ""
    inputUserCpf.value = ""
    inputBookName.value = ""
    inputBookCod.value = ""
}

function formatDate(date) {

    let year = date.getFullYear()
    let month = String(date.getMonth() + 1).padStart(2, "0")
    let day = String(date.getDate()).padStart(2, "0")

    return year + "-" + month + "-" + day
}

function saveRentals() {
    localStorage.setItem("rentals", JSON.stringify(rentals))
}

function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books))
}