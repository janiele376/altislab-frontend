const rentals = JSON.parse(localStorage.getItem("rentals")) || []
const books = JSON.parse(localStorage.getItem("books")) || []
const publishers = JSON.parse(localStorage.getItem("publishers")) || []

let cardOntime = document.querySelector("#card-ontime-val")
let cardExpiring = document.querySelector("#card-expiring-val")
let cardLate = document.querySelector("#card-late-val")

let latestRentalsList = document.querySelector("#latest-rentals-list")

let globalRentalsCount = document.querySelector("#global-rentals-count")
let globalBooksCount = document.querySelector("#global-books-count")
let globalPublishersCount = document.querySelector("#global-publishers-count")

let topRentedBooksList = document.querySelector("#top-rented-books-list")

let mostRentedTitle = document.querySelector("#most-rented-title")
let mostRentedPublisher = document.querySelector("#most-rented-publisher")
let mostRentedRelease = document.querySelector("#most-rented-release")
let mostRentedQuantity = document.querySelector("#most-rented-quantity")

showStatusCards()
showLatestRentals()
showGlobalCounts()
showTopRentedBooks()
showMostRentedBook()

function showStatusCards() {

    let ontime = 0
    let expiring = 0
    let late = 0

    let today = new Date()

    rentals.forEach(function (rental) {

        if (rental.status === "Inativo") {
            return
        }

        let dueDate = new Date(rental.dueDate + "T00:00:00")

        let difference = dueDate - today

        let daysRemaining = Math.ceil(
            difference / (1000 * 60 * 60 * 24)
        )

        if (daysRemaining < 0) {
            late++
        }
        else if (daysRemaining <= 3) {
            expiring++
        }
        else {
            ontime++
        }
    })

    cardOntime.textContent = ontime + " Aluguéis"
    cardExpiring.textContent = expiring + " Aluguéis"
    cardLate.textContent = late + " Aluguéis"
}

function showLatestRentals() {

    latestRentalsList.innerHTML = ""

    if (rentals.length === 0) {

        let item = document.createElement("li")
        item.textContent = "Nenhum aluguel registrado"

        latestRentalsList.appendChild(item)

        return
    }

    let latestRentals = rentals.slice()

    latestRentals.sort(function (a, b) {
        return b.id - a.id
    })

    latestRentals = latestRentals.slice(0, 5)

    latestRentals.forEach(function (rental) {

        let item = document.createElement("li")

        item.textContent =
            rental.bookName + " - " + rental.userName

        latestRentalsList.appendChild(item)
    })
}

function showGlobalCounts() {

    globalRentalsCount.textContent = rentals.length
    globalBooksCount.textContent = books.length
    globalPublishersCount.textContent = publishers.length
}

function showTopRentedBooks() {

    topRentedBooksList.innerHTML = ""

    if (rentals.length === 0) {

        let item = document.createElement("div")
        item.classList.add("item-qty")

        let name = document.createElement("span")
        name.textContent = "Nenhum aluguel computado"

        let quantity = document.createElement("span")
        quantity.textContent = "qtd. 0"

        item.appendChild(name)
        item.appendChild(quantity)

        topRentedBooksList.appendChild(item)

        return
    }

    let rentedBooks = []

    rentals.forEach(function (rental) {

        let bookExists = rentedBooks.find(function (book) {
            return book.bookId === rental.bookId
        })

        if (bookExists) {
            bookExists.quantity++
        }
        else {

            rentedBooks.push({
                bookId: rental.bookId,
                bookName: rental.bookName,
                quantity: 1
            })
        }
    })

    rentedBooks.sort(function (a, b) {
        return b.quantity - a.quantity
    })

    let topBooks = rentedBooks.slice(0, 5)

    topBooks.forEach(function (book) {

        let item = document.createElement("div")
        item.classList.add("item-qty")

        let name = document.createElement("span")
        name.textContent = book.bookName

        let quantity = document.createElement("span")
        quantity.textContent = "qtd. " + book.quantity

        item.appendChild(name)
        item.appendChild(quantity)

        topRentedBooksList.appendChild(item)
    })
}

function showMostRentedBook() {

    if (rentals.length === 0) {
        return
    }

    let rentedBooks = []

    rentals.forEach(function (rental) {

        let bookExists = rentedBooks.find(function (book) {
            return book.bookId === rental.bookId
        })

        if (bookExists) {
            bookExists.quantity++
        }
        else {

            rentedBooks.push({
                bookId: rental.bookId,
                quantity: 1
            })
        }
    })

    rentedBooks.sort(function (a, b) {
        return b.quantity - a.quantity
    })

    let mostRented = rentedBooks[0]

    let book = books.find(function (book) {
        return book.id === mostRented.bookId
    })

    if (!book) {
        return
    }

    mostRentedTitle.textContent = book.name
    mostRentedPublisher.textContent = book.publisherName
    mostRentedRelease.textContent = book.releaseDate
    mostRentedQuantity.textContent = mostRented.quantity
}