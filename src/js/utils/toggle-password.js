function togglePassword(input, button, path) {
    button.addEventListener("click", function() {

        if (input.type === "password") {
            input.type = "text"
            button.src = path + "visibility.svg"
        } else {
            input.type = "password"
            button.src = path + "visibility_off.svg"
        }
    })
}