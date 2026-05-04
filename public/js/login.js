// Escucha el envío del formulario para controlarlo con JavaScript.
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    // Evita el envío tradicional del formulario y la recarga de la página.
    e.preventDefault();

    // Recoge los datos escritos por el usuario.
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Envía las credenciales al backend en formato JSON.
    const res = await fetch("../backend/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    // Convierte la respuesta del servidor en un objeto JavaScript.
    const data = await res.json();

    if (data.success) {
        // Si el login es correcto, entra en la zona privada.
        window.location.href = "dashboard.html";
    } else {
        // Si falla, muestra el mensaje devuelto por PHP.
        document.getElementById("error").innerText = data.message;
    }
});
