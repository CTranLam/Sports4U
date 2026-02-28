let currentPage = 1;

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "../../pages/login.html";
        return;
    }

    await loadCategories(token);

    // Mở modal thêm danh mục
    document.getElementById("addCategoryBtn").addEventListener("click", () => {
        document.getElementById("categoryName").value = "";
        new bootstrap.Modal(document.getElementById("addCategoryModal")).show();
    });

    // Lưu danh mục
    document.getElementById("saveCategoryBtn").addEventListener("click", async () => {
        await createCategory(token);
    });
});

async function loadCategories(token) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/admin/categories?page=${currentPage}&size=10`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        const result = await response.json();
        if (!response.ok) {
            console.error(result.message);
            return;
        }

        renderCategories(result.data?.content || []);
        renderPagination(result.data, token);

    } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
    }
}

function renderCategories(categories) {
    const tbody = document.getElementById("categoryTableBody");

    if (categories.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted py-4">Không có danh mục nào</td></tr>`;
        return;
    }

    tbody.innerHTML = categories.map((cat, index) => `
        <tr style="cursor: pointer;" onclick="window.location.href='product-list.html?category=${cat.categoryId}&name=${encodeURIComponent(cat.categoryName)}'"">
            <td>${index + 1 + (currentPage - 1) * 10}</td>
            <td><div class="fw-semibold">${cat.categoryName}</div></td>
            <td class="text-center">${cat.productCount}</td>
            <td class="text-end">
                <a href="product-list.html?category=${cat.categoryId}"
                    class="btn btn-sm btn-outline-primary me-1"
                    onclick="event.stopPropagation()">
                    <i class="bi bi-eye me-1"></i>Xem
                </a>
                <button class="btn btn-sm btn-outline-danger"
                    onclick="event.stopPropagation(); openDeleteModal(${cat.categoryId}, '${cat.categoryName}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join("");
}

function openDeleteModal(categoryId, categoryName) {
    document.getElementById("deleteCategoryName").textContent = categoryName;
    document.getElementById("confirmDeleteBtn").onclick = async () => {
        await deleteCategory(categoryId);
    };
    new bootstrap.Modal(document.getElementById("deleteCategoryModal")).show();
}

async function createCategory(token) {
    const name = document.getElementById("categoryName").value.trim();
    if (!name) {
        alert("Vui lòng nhập tên danh mục");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/admin/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ categoryName: name })
        });

        const result = await response.json();
        if (response.ok) {
            alert("Thêm danh mục thành công");
            bootstrap.Modal.getInstance(document.getElementById("addCategoryModal")).hide();
            document.getElementById("categoryName").value = "";
            await loadCategories(token);
        } else {
            alert(result.message || "Thêm danh mục thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi thêm danh mục:", error);
    }
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
            await loadCategories(token);
        } else {
            alert(result.message || "Xóa danh mục thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi xóa danh mục:", error);
    }
}

function renderPagination(pageData, token) {
    const container = document.getElementById("paginationContainer");
    if (!container) return;
    container.innerHTML = "";

    const totalPages = pageData?.totalPages ?? 1;
    const current = currentPage;

    const prev = document.createElement("button");
    prev.className = "btn btn-sm btn-outline-secondary";
    prev.textContent = "‹";
    prev.disabled = current === 1;
    prev.onclick = async () => { currentPage = current - 1; await loadCategories(token); };
    container.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = `btn btn-sm ${i === current ? "btn-primary" : "btn-outline-primary"}`;
        btn.textContent = i;
        btn.onclick = async () => { currentPage = i; await loadCategories(token); };
        container.appendChild(btn);
    }

    const next = document.createElement("button");
    next.className = "btn btn-sm btn-outline-secondary";
    next.textContent = "›";
    next.disabled = current >= totalPages;
    next.onclick = async () => { currentPage = current + 1; await loadCategories(token); };
    container.appendChild(next);
}