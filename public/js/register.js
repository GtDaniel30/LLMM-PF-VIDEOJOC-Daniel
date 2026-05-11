// Escucha el formulario de registro para enviarlo con fetch().
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    // Evita la recarga automática de la página.
    e.preventDefault();

    // Recoge y limpia los datos del formulario.
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    // Manda usuario y contraseña al backend en formato JSON.
    const res = await fetch(window.APP_PATHS.url("backend/register.php"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    // Lee la respuesta JSON generada por PHP.
    const data = await res.json();
    // Muestra el mensaje de éxito o error en pantalla.
    message.innerText = data.message;

    if (data.success) {
        // Si el registro fue correcto, redirige al login tras una breve pausa.
        setTimeout(() => {
            window.location.href = window.APP_PATHS.url("public/login.html");
        }, 1000);
    }
});
