const emailInput = document.getElementById('email');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const nameInput = document.getElementById('name');
const lastnameInput = document.getElementById('lastname');
const ageInput = document.getElementById('age');
const button = document.getElementById("button");
const mensaje = document.getElementById("mensaje")

button.addEventListener("click", async(e) => {
    e.preventDefault()

    // Basic validations
    if (!emailInput.value.includes('@')) {
        mensaje.textContent = "Please use a valid email.";
        return;
    }

    if (usernameInput.value.trim() === "") {
        mensaje.textContent = "Username cannot be empty.";
        return;
    }

    if (passwordInput.value.length < 6) {
        mensaje.textContent = "Password must be at least 6 characters long.";
        return;
    }

    if (nameInput.value.trim() === "") {
        mensaje.textContent = "Name cannot be empty.";
        return;
    }

    if (lastnameInput.value.trim() === "") {
        mensaje.textContent = "Lastname cannot be empty.";
        return;
    }

    if (!ageInput.value) {
        mensaje.textContent = "Please select a valid date for age.";
        return;
    }

    let response = await fetch("http://127.0.0.1:5000/auth/sign_up", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
            "email": emailInput.value,
            "username": usernameInput.value,
            "password": passwordInput.value,
            "name": nameInput.value,
            "lastname": lastnameInput.value,
            "age": ageInput.value
        })
    })

    if (response.redirected) {
        window.location = response.url
    }

    if (!response.ok) {
        const data = await response.json();
        const errors = data["errors"];

        // Mostrar solo el primer error
        if (errors && typeof errors === 'object' && Object.keys(errors).length > 0) {
            const firstKey = Object.keys(errors)[0];
            mensaje.textContent = errors[firstKey];
        } else {
            mensaje.textContent = "An unexpected error occurred.";
        }
    }
})