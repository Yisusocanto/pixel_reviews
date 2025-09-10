const username = document.getElementById("username")
const password = document.getElementById("password")
const button = document.getElementById("button")
const message = document.getElementById("message")


button.addEventListener("click", async(e) => {
    e.preventDefault()

    let response = await fetch("http://127.0.0.1:5000/auth/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "username": username.value,
            "password": password.value
        })
    })

    if (response.redirected) {
        window.location = response.url
    }

    if (!response.ok) {
        let data = await response.json()
        message.textContent = data["error"]
    }
})