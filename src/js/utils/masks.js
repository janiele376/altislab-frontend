function maskCpf(input) {

    input.addEventListener("input", function () {

        let value = input.value

        value = value.replace(/\D/g, "")

        value = value.slice(0, 11)

        value = value.replace(/(\d{3})(\d)/, "$1.$2")
        value = value.replace(/(\d{3})(\d)/, "$1.$2")
        value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2")

        input.value = value
    })
}

function maskPhone(input) {

    input.addEventListener("input", function () {

        let value = input.value

        value = value.replace(/\D/g, "")

        value = value.slice(0, 11)

        value = value.replace(/^(\d{2})(\d)/, "($1) $2")
        value = value.replace(/(\d{5})(\d)/, "$1-$2")

        input.value = value
    })
}

function maskCnpj(input) {

    input.addEventListener("input", function () {

        let value = input.value

        value = value.replace(/\D/g, "")

        value = value.slice(0, 14)

        value = value.replace(/^(\d{2})(\d)/, "$1.$2")
        value = value.replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
        value = value.replace(/\.(\d{3})(\d)/, ".$1/$2")
        value = value.replace(/(\d{4})(\d)/, "$1-$2")

        input.value = value
    })
}

let inputMaskcpf = document.querySelector("#input-cpf")
let inputMaskphone = document.querySelector("#input-phone")
let inputMaskcnpj = document.querySelector("#publisher-cnpj")

if (inputMaskcpf) {
    maskCpf(inputMaskcpf)
}

if (inputMaskphone) {
    maskPhone(inputMaskphone)
}

if (inputMaskcnpj) {
    maskCnpj(inputMaskcnpj)
}