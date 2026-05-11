const loginLink = document.getElementById("loginLink");
const userInfo = document.getElementById("userInfo");
const logoutBtn = document.getElementById("logoutBtn");

function showLoggedOutState() {
    loginLink.hidden = false;
    userInfo.hidden = true;
    userInfo.innerText = "";
    logoutBtn.hidden = true;
}

function showLoggedInState(username) {
    loginLink.hidden = true;
    userInfo.hidden = false;
    userInfo.innerText = `Usuario: ${username}`;
    logoutBtn.hidden = false;
}

async function updateAuthState() {
    try {
        const res = await fetch(window.APP_PATHS.url("backend/session.php"));
        const data = await res.json();

        if (data.logged && data.user) {
            showLoggedInState(data.user);
            return;
        }
    } catch (error) {
    }

    showLoggedOutState();
}

logoutBtn.addEventListener("click", async () => {
    try {
        await fetch(window.APP_PATHS.url("backend/logout.php"));
    } finally {
        showLoggedOutState();
        window.location.href = window.APP_PATHS.url("index.html");
    }
});

updateAuthState();
