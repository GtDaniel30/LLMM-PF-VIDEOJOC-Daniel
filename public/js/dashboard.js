async function checkSession() {
    const res = await fetch(window.APP_PATHS.url("backend/session.php"));
    const data = await res.json();

    if (!data.logged) {
        window.location.href = window.APP_PATHS.url("public/login.html");
    } else {
        document.getElementById("userInfo").innerText = `Usuario: ${data.user}`;
    }
}

checkSession();

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch(window.APP_PATHS.url("backend/logout.php"));
    window.location.href = window.APP_PATHS.url("public/login.html");
});
