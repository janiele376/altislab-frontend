const usuarios = JSON.parse(localStorage.getItem("usuarios")) || []
const rentals = JSON.parse(localStorage.getItem("rentals")) || []
const books = JSON.parse(localStorage.getItem("books")) || []

const userLoggedId = Number(localStorage.getItem("userLoggedId"))

let tenantLoggedName = document.querySelector("#tenant-logged-name")
let profilePhoto = document.querySelector(".img-user")

let latestRentalsList = document.querySelector("#tenant-latest-rentals")
let statusTable = document.querySelector("#tenant-status-table")
let availableBooksList = document.querySelector("#available-books-list")

let mostRentedTitle = document.querySelector("#most-rented-title")
let mostRentedPublisher = document.querySelector("#most-rented-publisher")
let mostRentedRelease = document.querySelector("#most-rented-release")
let mostRentedQuantity = document.querySelector("#most-rented-quantity")

const userLogged = usuarios.find(function (user) {
    return user.id === userLoggedId
})

if (!userLogged) {
    window.location.href = "../index.html"
}
else {
    loadUser()
    showLatestRentals()
    showRentalStatus()
    showAvailableBooks()
    showMostRentedBook()
}

function loadUser() {

    tenantLoggedName.textContent = userLogged.name

    if (userLogged.photoProfile) {
        profilePhoto.src = userLogged.photoProfile
    }
    else {
        profilePhoto.src = "../../imgs/user.svg"
    }
}

function showLatestRentals() {

    latestRentalsList.innerHTML = ""

    let userRentals = rentals.filter(function (rental) {
        return rental.userId === userLoggedId
    })

    if (userRentals.length === 0) {

        let item = document.createElement("li")
        item.textContent = "Nenhum aluguel realizado"

        latestRentalsList.appendChild(item)

        return
    }

    userRentals.sort(function (a, b) {
        return b.id - a.id
    })

    let latestRentals = userRentals.slice(0, 5)

    latestRentals.forEach(function (rental) {

        let item = document.createElement("li")

        item.textContent =
            rental.bookName + " - " + rental.startDate

        latestRentalsList.appendChild(item)
    })
}

function showRentalStatus() {

    statusTable.innerHTML = ""

    let activeRentals = rentals.filter(function (rental) {
        return rental.userId === userLoggedId &&
            rental.status !== "Inativo"
    })

    if (activeRentals.length === 0) {

        let row = document.createElement("div")
        row.classList.add("status-row")

        let text = document.createElement("span")
        text.textContent = "Nenhum aluguel ativo"

        row.appendChild(text)

        statusTable.appendChild(row)

        return
    }

    activeRentals.forEach(function (rental) {

        let row = document.createElement("div")
        row.classList.add("status-row")

        let bookName = document.createElement("span")
        bookName.textContent = rental.bookName

        let dueDate = document.createElement("span")
        dueDate.textContent = rental.dueDate

        let status = document.createElement("span")

        let daysRemaining = calculateDaysRemaining(rental.dueDate)

        if (daysRemaining < 0) {
            status.textContent = "ATRASADO"
            status.classList.add("badge-red")
        }
        else if (daysRemaining <= 3) {
            status.textContent = "PERTO DE VENCER"
            status.classList.add("badge-yellow")
        }
        else {
            status.textContent = "EM DIA"
            status.classList.add("badge-green")
        }

        row.appendChild(bookName)
        row.appendChild(dueDate)
        row.appendChild(status)

        statusTable.appendChild(row)
    })
}

function showAvailableBooks() {

    availableBooksList.innerHTML = ""

    let availableBooks = books.filter(function (book) {
        return book.quantity > 0
    })

    if (availableBooks.length === 0) {

        let item = document.createElement("div")
        item.classList.add("item-qty")

        let name = document.createElement("span")
        name.textContent = "Nenhum livro disponível"

        let quantity = document.createElement("span")
        quantity.textContent = "qtd. 0"

        item.appendChild(name)
        item.appendChild(quantity)

        availableBooksList.appendChild(item)

        return
    }

    availableBooks.forEach(function (book) {

        let item = document.createElement("div")
        item.classList.add("item-qty")

        let name = document.createElement("span")
        name.textContent = book.name

        let quantity = document.createElement("span")
        quantity.textContent = "qtd. " + book.quantity

        item.appendChild(name)
        item.appendChild(quantity)

        availableBooksList.appendChild(item)
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

function calculateDaysRemaining(dueDate) {

    let today = new Date()
    let rentalDueDate = new Date(dueDate + "T00:00:00")

    let difference = rentalDueDate - today

    let daysRemaining = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
    )

    return daysRemaining
}