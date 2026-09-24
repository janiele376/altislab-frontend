const themeDark = document.querySelector(".btn-dark")
const themeLight = document.querySelector(".btn-light")
let body = document.querySelector("body")

const saveTheme = localStorage.getItem("theme")


function changeTheme(theme){
        if (theme === "dark") {
            body.classList.add("dark-mode")
            themeDark.classList.add("active")
            themeLight.classList.remove("active")
        } else {
            body.classList.remove("dark-mode")
            themeDark.classList.remove("active")
            themeLight.classList.add("active")
        }
}
changeTheme(saveTheme)

if (themeLight) {
    themeLight.addEventListener("click", function() {
        localStorage.setItem("theme", "light")
        changeTheme("light")
    })
}

if (themeDark) {
    themeDark.addEventListener("click", function() {
        localStorage.setItem("theme", "dark")
        changeTheme("dark")
    })
}