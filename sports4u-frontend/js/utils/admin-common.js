
document.addEventListener("DOMContentLoaded", function () {
    initAdminLogout();
});

function initAdminLogout() {
    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn?.addEventListener("click", () => {
        // Xóa dữ liệu đăng nhập
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminEmail");
        sessionStorage.removeItem("adminSession");

        // Chuyển hướng về trang login
        window.location.href = "../../pages/login.html";
    });
}
