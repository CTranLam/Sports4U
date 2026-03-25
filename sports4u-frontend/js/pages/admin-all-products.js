const API_BASE = "http://localhost:8080";
let currentPage = 1;
let activeFilters = {
    keyword: "",
    categoryId: "",
    minPrice: "",
    maxPrice: ""
};

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "../../pages/login.html";
        return;
    }

    await loadCategoryFilter(token);
    await loadProducts(token);

    // Filter buttons
    document.getElementById("applyFilterBtn").addEventListener("click", () => {
        currentPage = 1;
        activeFilters.keyword   = document.getElementById("filterKeyword").value.trim();
        activeFilters.categoryId = document.getElementById("filterCategory").value;
        activeFilters.minPrice  = document.getElementById("filterMinPrice").value;
        activeFilters.maxPrice  = document.getElementById("filterMaxPrice").value;
        loadProducts(token);
    });

    document.getElementById("resetFilterBtn").addEventListener("click", () => {
        document.getElementById("filterKeyword").value = "";
        document.getElementById("filterCategory").value = "";
        document.getElementById("filterMinPrice").value = "";
        document.getElementById("filterMaxPrice").value = "";
        activeFilters = { keyword: "", categoryId: "", minPrice: "", maxPrice: "" };
        currentPage = 1;
        loadProducts(token);
    });

    // Enter key on keyword input
    document.getElementById("filterKeyword").addEventListener("keydown", (e) => {
        if (e.key === "Enter") document.getElementById("applyFilterBtn").click();
    });

    // Add product
    document.getElementById("addProductBtn").addEventListener("click", () => {
        openProductModal(null, token);
    });

    // Save product
    document.getElementById("saveProductBtn").addEventListener("click", async () => {
        await saveProduct(token);
    });

    // Preview image
    document.getElementById("productImage").addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const preview = document.getElementById("productImagePreview");
            preview.src = URL.createObjectURL(file);
            preview.classList.remove("d-none");
        }
    });
});

// ── Load category dropdown for filter bar & modal ─────────────────────────────
async function loadCategoryFilter(token) {
    try {
        const res = await fetch(`${API_BASE}/api/admin/categories/children`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await res.json();
        if (!res.ok) return;

        // API trả về data là mảng trực tiếp
        const all = Array.isArray(result.data) ? result.data : (result.data?.content || []);
        const childCategories = all.filter(c => c.parentId);

        const filterSelect = document.getElementById("filterCategory");
        const modalSelect  = document.getElementById("productCategorySelect");

        childCategories.forEach(cat => {
            [filterSelect, modalSelect].forEach(sel => {
                const opt = document.createElement("option");
                opt.value = cat.categoryId;
                opt.textContent = cat.categoryName;
                sel.appendChild(opt);
            });
        });
    } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
    }
}

// ── Build query string from active filters ─────────────────────────────────────
function buildQueryParams() {
    const params = new URLSearchParams({
        page: currentPage,
        size: 10
    });
    if (activeFilters.keyword)    params.append("keyword",    activeFilters.keyword);
    if (activeFilters.categoryId) params.append("categoryId", activeFilters.categoryId);
    if (activeFilters.minPrice)   params.append("minPrice",   activeFilters.minPrice);
    if (activeFilters.maxPrice)   params.append("maxPrice",   activeFilters.maxPrice);
    return params.toString();
}

// ── Load products ─────────────────────────────────────────────────────────────
async function loadProducts(token) {
    const tbody = document.getElementById("allProductsTable");
    tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-5">
        <div class="spinner-border spinner-border-sm me-2" role="status"></div>Đang tải...
    </td></tr>`;

    try {
        const res = await fetch(
            `${API_BASE}/api/admin/products?${buildQueryParams()}`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
        const result = await res.json();
        if (!res.ok) {
            tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">${result.message || "Không thể tải sản phẩm"}</td></tr>`;
            return;
        }

        const products  = result.data?.content || [];
        const pageData  = result.data;

        renderProducts(products);
        renderResultInfo(pageData);
        renderPagination(pageData, token);
    } catch (err) {
        console.error("Lỗi khi tải sản phẩm:", err);
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">Lỗi kết nối server</td></tr>`;
    }
}

// ── Render table rows ─────────────────────────────────────────────────────────
function renderProducts(products) {
    const tbody = document.getElementById("allProductsTable");

    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-5">
            <i class="bi bi-inbox fs-3 d-block mb-2 text-secondary"></i>
            Không tìm thấy sản phẩm nào
        </td></tr>`;
        return;
    }

    const offset = (currentPage - 1) * 10;
    tbody.innerHTML = products.map((p, idx) => `
        <tr>
            <td class="text-muted small ps-3">${offset + idx + 1}</td>
            <td>
                <div class="d-flex align-items-center gap-3">
                    <img src="${p.imageUrl || ''}" class="product-img flex-shrink-0" width="54" height="54"
                        alt="${p.productName}" onerror="this.style.display='none'">
                    <div>
                        <div class="fw-semibold lh-sm">${p.productName}</div>
                        <small class="text-muted">${p.origin || ''}</small>
                    </div>
                </div>
            </td>
            <td><span class="badge-category">${p.categoryName || '—'}</span></td>
            <td class="fw-semibold text-nowrap">${new Intl.NumberFormat('vi-VN').format(p.price)}&thinsp;₫</td>
            <td class="text-center">
                <span class="badge rounded-pill ${p.quantity > 0 ? 'bg-success' : 'bg-danger'}">
                    ${p.quantity > 0 ? p.quantity : 'Hết hàng'}
                </span>
            </td>
            <td class="text-end pe-3 text-nowrap">
                <button class="btn btn-sm btn-light border me-1" title="Chỉnh sửa"
                    onclick="openProductModal(${JSON.stringify(p).replace(/"/g, '&quot;')})">
                    <i class="bi bi-pencil text-primary"></i>
                </button>
                <button class="btn btn-sm btn-light border" title="Xóa"
                    onclick="openDeleteModal(${p.productId}, '${p.productName.replace(/'/g, "\\'")}')">
                    <i class="bi bi-trash text-danger"></i>
                </button>
            </td>
        </tr>
    `).join("");
}

// ── Result info text ──────────────────────────────────────────────────────────
function renderResultInfo(pageData) {
    const info = document.getElementById("resultInfo");
    if (!pageData) { info.textContent = ""; return; }
    const total   = pageData.totalElements ?? 0;
    const start   = (currentPage - 1) * 10 + 1;
    const end     = Math.min(currentPage * 10, total);
    info.textContent = total > 0
        ? `Hiển thị ${start}–${end} trong tổng ${total} sản phẩm`
        : "Không có sản phẩm nào";
}

// ── Pagination ────────────────────────────────────────────────────────────────
function renderPagination(pageData, token) {
    const container = document.getElementById("paginationContainer");
    if (!container) return;
    container.innerHTML = "";

    const totalPages = pageData?.totalPages ?? 1;
    if (totalPages <= 1) return;

    const prev = document.createElement("button");
    prev.className = "btn btn-sm btn-outline-secondary";
    prev.innerHTML = `<i class="bi bi-chevron-left"></i>`;
    prev.disabled = currentPage === 1;
    prev.onclick = () => { currentPage--; loadProducts(localStorage.getItem("accessToken")); };
    container.appendChild(prev);

    const maxVisible = 7;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage   = Math.min(totalPages, startPage + maxVisible - 1);
    if (endPage - startPage < maxVisible - 1) startPage = Math.max(1, endPage - maxVisible + 1);

    if (startPage > 1) {
        addPageBtn(container, 1, token);
        if (startPage > 2) container.appendChild(makeEllipsis());
    }

    for (let i = startPage; i <= endPage; i++) addPageBtn(container, i, token);

    if (endPage < totalPages) {
        if (endPage < totalPages - 1) container.appendChild(makeEllipsis());
        addPageBtn(container, totalPages, token);
    }

    const next = document.createElement("button");
    next.className = "btn btn-sm btn-outline-secondary";
    next.innerHTML = `<i class="bi bi-chevron-right"></i>`;
    next.disabled = currentPage >= totalPages;
    next.onclick = () => { currentPage++; loadProducts(localStorage.getItem("accessToken")); };
    container.appendChild(next);
}

function addPageBtn(container, i, token) {
    const btn = document.createElement("button");
    btn.className = `btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline-primary"}`;
    btn.textContent = i;
    btn.onclick = () => { currentPage = i; loadProducts(localStorage.getItem("accessToken")); };
    container.appendChild(btn);
}

function makeEllipsis() {
    const span = document.createElement("span");
    span.className = "btn btn-sm disabled";
    span.textContent = "…";
    return span;
}

// ── Open Add/Edit modal ───────────────────────────────────────────────────────
async function openProductModal(product) {
    const token = localStorage.getItem("accessToken");
    const isEdit = product !== null;

    document.getElementById("productModalTitle").textContent = isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm";
    document.getElementById("editProductId").value        = isEdit ? product.productId : "";
    document.getElementById("productName").value          = isEdit ? product.productName : "";
    document.getElementById("productPrice").value         = isEdit ? product.price : "";
    document.getElementById("productQuantity").value      = isEdit ? product.quantity : "";
    document.getElementById("productOrigin").value        = isEdit ? (product.origin || "") : "";
    document.getElementById("productAdvantages").value    = isEdit ? (product.advantages || "") : "";
    document.getElementById("productCategorySelect").value = isEdit ? (product.categoryId || "") : "";

    const preview = document.getElementById("productImagePreview");
    if (isEdit && product.imageUrl) {
        preview.src = product.imageUrl;
        preview.classList.remove("d-none");
    } else {
        preview.src = "";
        preview.classList.add("d-none");
    }
    document.getElementById("productImage").value = "";

    new bootstrap.Modal(document.getElementById("productModal")).show();
}

// ── Save product (add or edit) ────────────────────────────────────────────────
async function saveProduct(token) {
    const productId  = document.getElementById("editProductId").value;
    const isEdit     = !!productId;
    const categoryId = document.getElementById("productCategorySelect").value;

    const data = {
        productName:   document.getElementById("productName").value.trim(),
        price:         parseFloat(document.getElementById("productPrice").value),
        stockQuantity: parseInt(document.getElementById("productQuantity").value),
        origin:        document.getElementById("productOrigin").value.trim(),
        advantages:    document.getElementById("productAdvantages").value.trim(),
        categoryId:    categoryId ? parseInt(categoryId) : null
    };

    const imageFile = document.getElementById("productImage").files[0];

    if (!data.productName || !data.price || !data.stockQuantity) {
        alert("Vui lòng nhập đầy đủ thông tin bắt buộc (Tên, Giá, Số lượng)");
        return;
    }
    if (!data.categoryId) {
        alert("Vui lòng chọn danh mục sản phẩm");
        return;
    }
    if (!isEdit && !imageFile) {
        alert("Vui lòng chọn hình ảnh cho sản phẩm mới");
        return;
    }

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (imageFile) formData.append("image", imageFile);

    const url    = isEdit ? `${API_BASE}/api/admin/products/${productId}` : `${API_BASE}/api/admin/product`;
    const method = isEdit ? "PUT" : "POST";

    try {
        const res    = await fetch(url, { method, headers: { "Authorization": `Bearer ${token}` }, body: formData });
        const result = await res.json();
        if (res.ok) {
            alert(isEdit ? "Cập nhật sản phẩm thành công!" : "Thêm sản phẩm thành công!");
            bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
            await loadProducts(token);
        } else {
            alert(result.message || "Lưu sản phẩm thất bại");
        }
    } catch (err) {
        console.error("Lỗi khi lưu sản phẩm:", err);
    }
}

// ── Delete product ────────────────────────────────────────────────────────────
function openDeleteModal(productId, productName) {
    document.getElementById("deleteProductName").textContent = productName;
    document.getElementById("confirmDeleteProductBtn").onclick = async () => {
        await deleteProduct(productId);
    };
    new bootstrap.Modal(document.getElementById("deleteProductModal")).show();
}

async function deleteProduct(productId) {
    const token = localStorage.getItem("accessToken");
    try {
        const res    = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await res.json();
        if (res.ok) {
            alert("Xóa sản phẩm thành công!");
            bootstrap.Modal.getInstance(document.getElementById("deleteProductModal")).hide();
            await loadProducts(token);
        } else {
            alert(result.message || "Xóa sản phẩm thất bại");
        }
    } catch (err) {
        console.error("Lỗi khi xóa sản phẩm:", err);
    }
}
