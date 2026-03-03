document.addEventListener("DOMContentLoaded", async function () {
    initAdminLogout();
    await loadSidebarCategories();
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

async function loadSidebarCategories() {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
        const response = await fetch(
            "http://localhost:8080/api/admin/categories?page=1&size=100",
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        const result = await response.json();
        if (!response.ok) return;

        const categories = result.data?.content || [];
        renderSidebarCategories(categories);

    } catch (error) {
        console.error("Lỗi khi tải sidebar categories:", error);
    }
}
