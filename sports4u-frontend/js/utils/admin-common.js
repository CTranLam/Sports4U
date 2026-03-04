document.addEventListener("DOMContentLoaded", async function () {
    initAdminLogout();
});

function initAdminLogout() {
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn?.addEventListener("click", () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("adminEmail");
        sessionStorage.removeItem("adminSession");
        window.location.href = "../../pages/login.html";
    });
}
