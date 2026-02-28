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

function renderSidebarCategories(categories) {
    const sportMenu = document.getElementById("sportMenu");
    if (!sportMenu) return;

    sportMenu.innerHTML = `
        <a class="nav-link text-white-50" href="product-category.html">Danh mục sản phẩm</a>
        ${categories.map(cat => `
            <a class="nav-link text-white-50" href="product-list.html?category=${cat.categoryId}&name=${encodeURIComponent(cat.categoryName)}">
                ${cat.categoryName}
            </a>
        `).join("")}
    `;
}