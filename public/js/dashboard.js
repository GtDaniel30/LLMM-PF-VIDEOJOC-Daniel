async function checkSession() {
    const res = await fetch("../backend/session.php");
    const data = await res.json();

    if (!data.logged) {
        window.location.href = "login.html";
    } else {
        document.getElementById("userInfo").innerText = `Usuario: ${data.user}`;
    }
}

checkSession();


document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch("../backend/logout.php");
    window.location.href = "login.html";
});