document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("error")) {
        alert("Thanh toán thất bại. Vui lòng thử lại.");
        history.replaceState({}, '', window.location.pathname);
    } else if (urlParams.get("success") === "true") {
        alert("Thanh toán VNPay thành công! Đơn hàng của bạn đã được xác nhận.");
        history.replaceState({}, '', window.location.pathname);
    }

    await loadSidebar();
});

function doSearch() {
    const keyword = document.getElementById("searchInput")?.value?.trim();
    if (!keyword) return;
    window.location.href = `pages/product-list.html?keyword=${encodeURIComponent(keyword)}`;
}

function buildProductCardHTML(product, showHotBadge = false) {
    return `
        <div class="col-lg-3 col-md-4 col-sm-6">
            <a href="pages/product-detail.html?id=${product.productId}" class="text-decoration-none text-dark h-100 d-block">
                <div class="card border-0 bg-secondary bg-opacity-10 p-3 h-100 shadow-sm position-relative">
                    ${showHotBadge ? '<span class="badge bg-danger position-absolute top-0 end-0 m-2">HOT</span>' : ""}
                    <img src="${product.imageUrl}" class="img-fluid mb-3" alt="${product.productName}"
                         style="object-fit:contain; max-height:200px; width:100%">
                    <p class="mb-1 small fw-semibold text-truncate">${product.productName}</p>
                    <p class="text-muted small mb-0">
                        ${new Intl.NumberFormat('vi-VN').format(product.price || 0)} VND
                    </p>
                </div>
            </a>
        </div>
    `;
}

async function fetchPopularProductsByCategory(categoryId, page = 1, size = 4) {
    const response = await fetch(`http://localhost:8080/api/products/popular/${categoryId}?page=${page}&size=${size}`);
    if (!response.ok) {
        throw new Error("Không thể tải danh sách sản phẩm hot");
    }

    const result = await response.json();
    const pageData = result?.data || {};

    return {
        content: Array.isArray(pageData.content) ? pageData.content : [],
        pageNumber: Number(pageData.pageNumber || page),
        pageSize: Number(pageData.pageSize || size),
        totalElements: Number(pageData.totalElements || 0),
        totalPages: Number(pageData.totalPages || 1),
        last: Boolean(pageData.last)
    };
}

function renderHotProductsSection(mainContent, categoryId) {
    const hotSection = document.createElement("section");
    hotSection.className = "mb-5";

    const pageSize = 4;
    let currentPage = 1;

    async function renderPage() {
        hotSection.innerHTML = `<div class="text-muted small py-2">Đang tải sản phẩm hot...</div>`;

        try {
            const pageData = await fetchPopularProductsByCategory(categoryId, currentPage, pageSize);
            const total = pageData.totalElements;
            const totalPages = Math.max(1, pageData.totalPages || 1);
            currentPage = Math.min(Math.max(pageData.pageNumber || currentPage, 1), totalPages);

            const paginationHtml = totalPages > 1
                ? `<nav class="d-flex justify-content-center mt-3" aria-label="Hot products pagination">
                        <ul class="pagination pagination-sm mb-0">
                            <li class="page-item ${currentPage === 1 ? "disabled" : ""}">
                                <button class="page-link" data-hot-page="${currentPage - 1}" ${currentPage === 1 ? "disabled" : ""}><</button>
                            </li>
                            ${Array.from({ length: totalPages }, (_, i) => i + 1).map(page => `
                                <li class="page-item ${page === currentPage ? "active" : ""}">
                                    <button class="page-link" data-hot-page="${page}">${page}</button>
                                </li>
                            `).join("")}
                            <li class="page-item ${currentPage === totalPages ? "disabled" : ""}">
                                <button class="page-link" data-hot-page="${currentPage + 1}" ${currentPage === totalPages ? "disabled" : ""}>></button>
                            </li>
                        </ul>
                   </nav>`
                : "";

            hotSection.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0 text-danger"><i class="bi bi-fire me-2"></i>Sản phẩm hot</h5>
                    <span class="small text-muted">${total} sản phẩm nổi bật</span>
                </div>
                ${total > 0
                    ? `<div class="row g-3">${pageData.content.map(product => buildProductCardHTML(product, true)).join("")}</div>${paginationHtml}`
                    : `<div class="text-muted small fst-italic py-2">Hiện chưa có sản phẩm hot</div>`}
            `;

            hotSection.querySelectorAll("[data-hot-page]").forEach(btn => {
                btn.addEventListener("click", () => {
                    const nextPage = Number(btn.getAttribute("data-hot-page"));
                    if (!Number.isNaN(nextPage) && nextPage !== currentPage && nextPage >= 1 && nextPage <= totalPages) {
                        currentPage = nextPage;
                        renderPage();
                    }
                });
            });
        } catch (error) {
            console.error("Lỗi tải sản phẩm hot:", error);
            hotSection.innerHTML = `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0 text-danger"><i class="bi bi-fire me-2"></i>Sản phẩm hot</h5>
                </div>
                <div class="text-danger small fst-italic py-2">Không tải được sản phẩm hot</div>
            `;
        }
    }

    renderPage();
    mainContent.appendChild(hotSection);
}

// ── SIDEBAR: hiển thị danh mục cha ──
async function loadSidebar() {
    const sidebar = document.getElementById("category-sidebar");
    if (!sidebar) return;

    try {
        const res = await fetch("http://localhost:8080/api/categories/parents");
        const result = await res.json();
        const parents = result.data?.categories || [];

        if (parents.length === 0) {
            sidebar.innerHTML = `<div class="text-muted small">Chưa có danh mục</div>`;
            return;
        }

        sidebar.innerHTML = "";

        parents.forEach((parent, index) => {
            const item = document.createElement("div");
            item.className = "sidebar-parent-item py-2 px-3 rounded mb-1";
            item.style.cursor = "pointer";
            item.style.fontSize = "13px";
            item.style.fontWeight = "600";
            item.textContent = parent.categoryName;

            item.addEventListener("click", () => {
                // Active state
                document.querySelectorAll(".sidebar-parent-item").forEach(el => {
                    el.classList.remove("active", "bg-primary", "text-white");
                });
                item.classList.add("active", "bg-primary", "text-white");

                loadMainContent(parent.categoryId);
            });

            sidebar.appendChild(item);

            // Tự động load danh mục đầu tiên
            if (index === 0) {
                item.classList.add("active", "bg-primary", "text-white");
                loadMainContent(parent.categoryId);
            }
        });

    } catch (error) {
        console.error("Lỗi sidebar:", error);
        sidebar.innerHTML = `<div class="text-danger small">Lỗi tải danh mục</div>`;
    }
}

// ── MAIN CONTENT: hiển thị category con + product ──
async function loadMainContent(parentId) {
    const mainContent = document.getElementById("main-content");
    if (!mainContent) return;

    mainContent.innerHTML = `<div class="text-muted text-center py-5">Đang tải...</div>`;

    try {
        // Lấy danh mục con
        const childRes = await fetch(`http://localhost:8080/api/categories/${parentId}/child`);
        const childResult = await childRes.json();
        const children = Array.isArray(childResult.data) ? childResult.data : [];

        if (children.length === 0) {
            mainContent.innerHTML = `<div class="alert alert-info">Chưa có danh mục con</div>`;
            return;
        }

        mainContent.innerHTML = "";
        const sectionsHTML = [];

        for (const child of children) {
            const productRes = await fetch(`http://localhost:8080/api/categories/${child.categoryId}/products?page=1&size=4`);

            let products = [];
            if (productRes.ok) {
                const productResult = await productRes.json();
                products = productResult.data?.content || [];
            }

            const productsHTML = products.length > 0
                ? `<div class="row g-3">
                    ${products.map(product => buildProductCardHTML(product)).join("")}
                   </div>`
                : `<div class="text-muted small fst-italic py-2">Chưa có sản phẩm nào trong danh mục này</div>`;

            sectionsHTML.push(`
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="mb-0">${child.categoryName}</h5>
                    <a href="pages/product-list.html?category=${child.categoryId}&name=${encodeURIComponent(child.categoryName)}"
                       class="text-decoration-none small">Xem tất cả →</a>
                </div>
                ${productsHTML}
            `);
        }

        renderHotProductsSection(mainContent, parentId);

        sectionsHTML.forEach(sectionHtml => {
            const section = document.createElement("section");
            section.className = "mb-5";
            section.innerHTML = sectionHtml;
            mainContent.appendChild(section);
        });

        if (mainContent.children.length === 0) {
            mainContent.innerHTML = `<div class="alert alert-info">Chưa có danh mục con nào</div>`;
        }

    } catch (error) {
        console.error("Lỗi load main content:", error);
        mainContent.innerHTML = `<div class="alert alert-danger">Lỗi tải sản phẩm</div>`;
    }
}