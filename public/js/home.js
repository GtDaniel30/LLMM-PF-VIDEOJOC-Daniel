async function redirectIfLoggedIn() {
    try {
        const res = await fetch(window.APP_PATHS.url("backend/session.php"));
        const data = await res.json();

        if (data.logged) {
            window.location.href = window.APP_PATHS.url("Tableros/index.html");
        }
    } catch (error) {
        // Si falla la comprobacion, la portada publica sigue visible.
    }
}

redirectIfLoggedIn();
