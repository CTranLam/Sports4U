let currentPage = 1;
let expandedCategoryId = null;
let allCategories = []; // Store all categories for parent dropdown

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "../../pages/login.html";
        return;
    }

    await loadParentCategories(token);

    document.getElementById("addCategoryBtn").addEventListener("click", async () => {
        document.getElementById("categoryName").value = "";
        document.getElementById("parentCategorySelect").value = "";
        await populateParentDropdown(token);
        new bootstrap.Modal(document.getElementById("addCategoryModal")).show();
    });

    document.getElementById("saveCategoryBtn").addEventListener("click", async () => {
        await createCategory(token);
    });

    document.getElementById("addProductFromCategoryBtn").addEventListener("click", async () => {
        await openAddProductModal(token);
    });

    document.getElementById("newProductImage").addEventListener("change", function () {
        const file = this.files[0];
        const preview = document.getElementById("newProductImagePreview");
        if (file) {
            preview.src = URL.createObjectURL(file);
            preview.classList.remove("d-none");
        } else {
            preview.src = "";
            preview.classList.add("d-none");
        }
    });

    document.getElementById("saveProductFromCategoryBtn").addEventListener("click", async () => {
        await saveProductFromCategory(token);
    });
});

// ── Lấy tất cả categories và populate dropdown ──
async function populateParentDropdown(token) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/admin/categories?page=1&size=100`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
        const result = await response.json();
        if (!response.ok) { console.error(result.message); return; }

        allCategories = result.data?.content || [];
        const select = document.getElementById("parentCategorySelect");
        select.innerHTML = '<option value="">-- Không chọn (Thêm làm danh mục chính) --</option>';

        // Chỉ hiển thị parent categories (những cái không có parentId)
        const parentCategories = allCategories.filter(cat => !cat.parentId);
        parentCategories.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.categoryId;
            option.textContent = cat.categoryName;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Lỗi khi populate dropdown:", error);
    }
}

// ── CẤP 1: Load danh mục cha ──
async function loadParentCategories(token) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/admin/categories?page=${currentPage}&size=10`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
        const result = await response.json();
        if (!response.ok) { console.error(result.message); return; }

        renderParentCategories(result.data?.content || []);
        renderPagination(result.data, token);
    } catch (error) {
        console.error("Lỗi khi tải danh mục cha:", error);
    }
}

// ── RENDER DANH MỤC CHA ──
function renderParentCategories(categories) {
    const tbody = document.getElementById("categoryTableBody");

    if (categories.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">Không có danh mục nào</td></tr>`;
        return;
    }

    tbody.innerHTML = categories.map((cat, index) => `
        <tr style="cursor: pointer;" onclick="toggleChildren(${cat.categoryId}, '${cat.categoryName}')">
            <td>${index + 1 + (currentPage - 1) * 10}</td>
            <td>
                <i id="icon-${cat.categoryId}" class="bi bi-chevron-right me-2 text-muted icon-chevron"></i>
                <span class="fw-semibold">${cat.categoryName}</span>
            </td>
            <td class="text-center"><span class="badge bg-light text-dark border">${cat.productCount ?? 0}</span></td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-danger"
                    onclick="event.stopPropagation(); openDeleteModal(${cat.categoryId}, '${cat.categoryName}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
        <tr id="children-row-${cat.categoryId}" style="display:none;">
            <td colspan="4" class="p-0">
                <div id="children-content-${cat.categoryId}" class="ps-4 pe-2 py-2 bg-light border-bottom">
                    <div class="text-muted text-center py-2 small">Đang tải...</div>
                </div>
            </td>
        </tr>
    `).join("");
}

// ── TOGGLE EXPAND/COLLAPSE ──
async function toggleChildren(categoryId, categoryName) {
    const childrenRow = document.getElementById(`children-row-${categoryId}`);
    const icon = document.getElementById(`icon-${categoryId}`);
    const isOpen = expandedCategoryId === categoryId;

    // Đóng row đang mở
    if (expandedCategoryId && expandedCategoryId !== categoryId) {
        document.getElementById(`children-row-${expandedCategoryId}`).style.display = "none";
        document.getElementById(`icon-${expandedCategoryId}`).classList.remove("open");
    }

    if (isOpen) {
        childrenRow.style.display = "none";
        icon.classList.remove("open");
        expandedCategoryId = null;
    } else {
        childrenRow.style.display = "table-row";
        icon.classList.add("open");
        expandedCategoryId = categoryId;
        await loadChildCategories(categoryId);
    }
}

// ── CẤP 2: Load danh mục con ──
async function loadChildCategories(parentId) {
    const token = localStorage.getItem("accessToken");
    const content = document.getElementById(`children-content-${parentId}`);

    try {
        const response = await fetch(
            `http://localhost:8080/api/admin/categories/${parentId}/child`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
        const result = await response.json();
        if (!response.ok) {
            content.innerHTML = `<div class="text-danger small py-2">${result.message}</div>`;
            return;
        }

        const children = result.data || [];
        if (children.length === 0) {
            content.innerHTML = `<div class="text-muted text-center small py-2">Chưa có danh mục con</div>`;
            return;
        }

        content.innerHTML = `
            <table class="table table-sm mb-0">
                <tbody>
                    ${children.map(child => `
                        <tr style="cursor:pointer;"
                            onclick="window.location.href='product-list.html?category=${child.categoryId}&name=${encodeURIComponent(child.categoryName)}'">
                            <td style="width:40px"></td>
                            <td>
                                <i class="bi bi-tag me-2 text-primary" style="font-size:12px"></i>
                                <span class="fw-medium">${child.categoryName}</span>
                            </td>
                            <td class="text-center">
                                <span class="badge bg-light text-dark border">${child.productCount ?? 0}</span>
                            </td>
                            <td class="text-end">
                                <a href="product-list.html?category=${child.categoryId}&name=${encodeURIComponent(child.categoryName)}"
                                    class="btn btn-sm btn-outline-primary me-1"
                                    onclick="event.stopPropagation()">
                                    <i class="bi bi-eye me-1"></i>Xem SP
                                </a>
                                <button class="btn btn-sm btn-outline-danger"
                                    onclick="event.stopPropagation(); openDeleteModal(${child.categoryId}, '${child.categoryName}')">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        `;
    } catch (error) {
        content.innerHTML = `<div class="text-danger small py-2">Lỗi khi tải danh mục con</div>`;
    }
}

// ── MỞ MODAL THÊM SẢN PHẨM ──
async function openAddProductModal(token) {
    // Reset form
    document.getElementById("newProductName").value = "";
    document.getElementById("newProductPrice").value = "";
    document.getElementById("newProductQuantity").value = "";
    document.getElementById("newProductOrigin").value = "";
    document.getElementById("newProductAdvantages").value = "";
    document.getElementById("newProductImage").value = "";
    document.getElementById("newProductImagePreview").src = "";
    document.getElementById("newProductImagePreview").classList.add("d-none");

    // Load danh mục con vào dropdown
    await populateChildCategoryDropdown(token);

    new bootstrap.Modal(document.getElementById("addProductFromCategoryModal")).show();
}

async function populateChildCategoryDropdown(token) {
    const select = document.getElementById("productCategorySelect");
    select.innerHTML = '<option value="">-- Chọn danh mục con --</option>';

    try {
        const response = await fetch(
            `http://localhost:8080/api/admin/categories/children`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );
        const result = await response.json();
        if (!response.ok) return;

        // API trả về data là mảng trực tiếp
        const all = Array.isArray(result.data) ? result.data : (result.data?.content || []);
        // Chỉ lấy danh mục con (có parentId)
        const children = all.filter(cat => cat.parentId);

        if (children.length === 0) {
            select.innerHTML += '<option disabled>Chưa có danh mục con nào</option>';
            return;
        }

        children.forEach(cat => {
            const option = document.createElement("option");
            option.value = cat.categoryId;
            option.textContent = cat.categoryName;
            select.appendChild(option);
        });
    } catch (error) {
        console.error("Lỗi populate child categories:", error);
    }
}

async function saveProductFromCategory(token) {
    const categoryId = document.getElementById("productCategorySelect").value;
    const productName = document.getElementById("newProductName").value.trim();
    const price = parseFloat(document.getElementById("newProductPrice").value);
    const stockQuantity = parseInt(document.getElementById("newProductQuantity").value);
    const origin = document.getElementById("newProductOrigin").value.trim();
    const advantages = document.getElementById("newProductAdvantages").value.trim();
    const imageFile = document.getElementById("newProductImage").files[0];

    if (!categoryId) { alert("Vui lòng chọn danh mục"); return; }
    if (!productName) { alert("Vui lòng nhập tên sản phẩm"); return; }
    if (!price || price <= 0) { alert("Vui lòng nhập giá hợp lệ"); return; }
    if (!stockQuantity || stockQuantity < 0) { alert("Vui lòng nhập số lượng hợp lệ"); return; }
    if (!imageFile) { alert("Vui lòng chọn hình ảnh"); return; }

    const data = { productName, price, stockQuantity, origin, advantages, categoryId: parseInt(categoryId) };
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
    formData.append("image", imageFile);

    try {
        const response = await fetch("http://localhost:8080/api/admin/product", {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });
        const result = await response.json();
        if (response.ok) {
            alert("Thêm sản phẩm thành công");
            bootstrap.Modal.getInstance(document.getElementById("addProductFromCategoryModal")).hide();
            // Reload lại danh mục để cập nhật productCount
            await loadParentCategories(token);
        } else {
            alert(result.message || "Thêm sản phẩm thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi thêm sản phẩm:", error);
    }
}

// ── THÊM DANH MỤC ──
async function createCategory(token) {
    const name = document.getElementById("categoryName").value.trim();
    const parentId = document.getElementById("parentCategorySelect").value;
    
    if (!name) { alert("Vui lòng nhập tên danh mục"); return; }

    const body = parentId 
        ? { categoryName: name, parentId: parseInt(parentId) }
        : { categoryName: name };

    try {
        const response = await fetch("http://localhost:8080/api/admin/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
            body: JSON.stringify(body)
        });
        const result = await response.json();
        if (response.ok) {
            alert("Thêm danh mục thành công");
            bootstrap.Modal.getInstance(document.getElementById("addCategoryModal")).hide();
            document.getElementById("categoryName").value = "";
            document.getElementById("parentCategorySelect").value = "";

            await loadParentCategories(token);
        } else {
            alert(result.message || "Thêm danh mục thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
    }
}

// ── XÓA DANH MỤC ──
function openDeleteModal(categoryId, categoryName) {
    document.getElementById("deleteCategoryName").textContent = categoryName;
    document.getElementById("confirmDeleteBtn").onclick = async () => await deleteCategory(categoryId);
    new bootstrap.Modal(document.getElementById("deleteCategoryModal")).show();
}

async function deleteCategory(categoryId) {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await fetch(`http://localhost:8080/api/admin/categories/${categoryId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response.json();
        if (response.ok) {
            alert("Xóa danh mục thành công");
            bootstrap.Modal.getInstance(document.getElementById("deleteCategoryModal")).hide();
            expandedCategoryId = null;
            await loadParentCategories(token);
        } else {
            alert(result.message || "Xóa danh mục thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
    }
}

// ── PHÂN TRANG ──
function renderPagination(pageData, token) {
    const container = document.getElementById("paginationContainer");
    if (!container) return;
    container.innerHTML = "";

    const totalPages = pageData?.totalPages ?? 1;

    const prev = document.createElement("button");
    prev.className = "btn btn-sm btn-outline-secondary";
    prev.textContent = "‹";
    prev.disabled = currentPage === 1;
    prev.onclick = async () => { currentPage--; await loadParentCategories(token); };
    container.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = `btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline-primary"}`;
        btn.textContent = i;
        btn.onclick = async () => { currentPage = i; await loadParentCategories(token); };
        container.appendChild(btn);
    }

    const next = document.createElement("button");
    next.className = "btn btn-sm btn-outline-secondary";
    next.textContent = "›";
    next.disabled = currentPage >= totalPages;
    next.onclick = async () => { currentPage++; await loadParentCategories(token); };
    container.appendChild(next);
}