const books = JSON.parse(localStorage.getItem("books")) || []
const publishers = JSON.parse(localStorage.getItem("publishers")) || []

let booksList = document.querySelector("#books-list")

let btnOpenModal = document.querySelector("#open-modal-create")
let btnCloseModal = document.querySelector("#close-modal-create")
let btnSaveBook = document.querySelector("#btn-save-book")
let btnCancel = document.querySelector("#cancel-create")

let modalCreate = document.querySelector("#modal-create")
let modalTitle = document.querySelector("#modal-book-title")

let inputName = document.querySelector("#book-name")
let inputCod = document.querySelector("#book-cod")
let inputPublisher = document.querySelector("#book-publisher")
let inputDate = document.querySelector("#book-date")
let inputQuantity = document.querySelector("#book-quantity")

let inputSearch = document.querySelector("#input-search")
let btnSearch = document.querySelector("#btn-search")

let btnPrev = document.querySelector("#btn-prev")
let btnNext = document.querySelector("#btn-next")
let currentPageText = document.querySelector("#current-page")
let totalPagesText = document.querySelector("#total-pages")

let currentPage = 1
let itemsPerPage = 5
let editingBookId = null

showPublishers()
showBooks(books)

btnOpenModal.addEventListener("click", function () {
    editingBookId = null
    modalTitle.textContent = "Criar Livro"
    clearInputs()
    modalCreate.showModal()
})

btnCloseModal.addEventListener("click", function () {
    modalCreate.close()
})

btnCancel.addEventListener("click", function () {
    clearInputs()
})

btnSaveBook.addEventListener("click", function () {

    if (
        inputName.value === "" ||
        inputCod.value === "" ||
        inputPublisher.value === "" ||
        inputDate.value === "" ||
        inputQuantity.value === ""
    ) {
        alert("Preencha todos os campos!")
        return
    }

    if (Number(inputQuantity.value) < 1) {
        alert("A quantidade deve ser maior que zero!")
        return
    }

    if (editingBookId === null) {
        createBook()
    }
    else {
        editBook()
    }
})

btnSearch.addEventListener("click", function () {
    searchBooks()
})

inputSearch.addEventListener("input", function () {
    searchBooks()
})

btnPrev.addEventListener("click", function () {

    if (currentPage > 1) {
        currentPage--
        searchBooks()
    }
})

btnNext.addEventListener("click", function () {

    const filteredBooks = filterBooks()
    const totalPages = Math.ceil(filteredBooks.length / itemsPerPage)

    if (currentPage < totalPages) {
        currentPage++
        searchBooks()
    }
})

function createBook() {

    const bookExists = books.find(function (book) {
        return book.cod === inputCod.value
    })

    if (bookExists) {
        alert("Já existe um livro com esse código!")
        return
    }

    const publisher = publishers.find(function (publisher) {
        return publisher.id === Number(inputPublisher.value)
    })

    const book = {
        id: Date.now(),
        name: inputName.value,
        cod: inputCod.value,
        publisherId: publisher.id,
        publisherName: publisher.name,
        releaseDate: inputDate.value,
        quantity: Number(inputQuantity.value)
    }

    books.push(book)

    saveBooks()

    clearInputs()

    modalCreate.close()

    currentPage = 1

    showBooks(books)
}

function showBooks(bookList) {

    booksList.innerHTML = ""

    let totalPages = Math.ceil(bookList.length / itemsPerPage)

    if (totalPages === 0) {
        totalPages = 1
    }

    if (currentPage > totalPages) {
        currentPage = totalPages
    }

    let start = (currentPage - 1) * itemsPerPage
    let end = start + itemsPerPage

    const booksPage = bookList.slice(start, end)

    booksPage.forEach(function (book) {

        let bookRow = document.createElement("div")
        bookRow.classList.add("book-row")

        let cod = document.createElement("p")
        cod.textContent = book.cod

        let name = document.createElement("p")
        name.textContent = book.name

        let publisher = document.createElement("p")
        publisher.textContent = book.publisherName

        let releaseDate = document.createElement("p")
        releaseDate.textContent = book.releaseDate

        let quantity = document.createElement("p")
        quantity.textContent = book.quantity

        let btnEdit = document.createElement("button")
        btnEdit.textContent = "Editar"
        btnEdit.classList.add("btn-edit")

        btnEdit.addEventListener("click", function () {
            openEditBook(book.id)
        })

        bookRow.appendChild(cod)
        bookRow.appendChild(name)
        bookRow.appendChild(publisher)
        bookRow.appendChild(releaseDate)
        bookRow.appendChild(quantity)
        bookRow.appendChild(btnEdit)

        booksList.appendChild(bookRow)
    })

    currentPageText.textContent = currentPage
    totalPagesText.textContent = totalPages
}

function openEditBook(id) {

    const book = books.find(function (book) {
        return book.id === id
    })

    if (!book) {
        return
    }

    editingBookId = book.id

    inputName.value = book.name
    inputCod.value = book.cod
    inputPublisher.value = book.publisherId
    inputDate.value = book.releaseDate
    inputQuantity.value = book.quantity

    modalTitle.textContent = "Editar Livro"

    modalCreate.showModal()
}

function editBook() {

    const book = books.find(function (book) {
        return book.id === editingBookId
    })

    if (!book) {
        return
    }

    const codExists = books.find(function (otherBook) {
        return otherBook.cod === inputCod.value &&
            otherBook.id !== editingBookId
    })

    if (codExists) {
        alert("Já existe outro livro com esse código!")
        return
    }

    const publisher = publishers.find(function (publisher) {
        return publisher.id === Number(inputPublisher.value)
    })

    book.name = inputName.value
    book.cod = inputCod.value
    book.publisherId = publisher.id
    book.publisherName = publisher.name
    book.releaseDate = inputDate.value
    book.quantity = Number(inputQuantity.value)

    saveBooks()

    editingBookId = null

    clearInputs()

    modalCreate.close()

    searchBooks()
}

function showPublishers() {

    publishers.forEach(function (publisher) {

        let option = document.createElement("option")

        option.value = publisher.id
        option.textContent = publisher.name

        inputPublisher.appendChild(option)
    })
}

function searchBooks() {
    currentPage = 1
    const filteredBooks = filterBooks()
    showBooks(filteredBooks)
}

function filterBooks() {

    let search = inputSearch.value.toLowerCase()

    return books.filter(function (book) {
        return book.name.toLowerCase().includes(search) ||
            book.cod.toLowerCase().includes(search) ||
            book.publisherName.toLowerCase().includes(search)
    })
}

function clearInputs() {
    inputName.value = ""
    inputCod.value = ""
    inputPublisher.value = ""
    inputDate.value = ""
    inputQuantity.value = "1"
}

function saveBooks() {
    localStorage.setItem("books", JSON.stringify(books))
}