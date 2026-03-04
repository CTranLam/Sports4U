let currentPage = 1;
let categoryId = null;

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "../../pages/login.html";
        return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    categoryId = urlParams.get("category");

    if (!categoryId) {
        alert("Không tìm thấy danh mục");
        window.location.href = "product-category.html";
        return;
    }

    await loadProducts(token);

    // Thêm sản phẩm
    document.getElementById("addProductBtn").addEventListener("click", () => {
        openProductModal(null);
    });

    // Lưu sản phẩm
    document.getElementById("saveProductBtn").addEventListener("click", async () => {
        await saveProduct(token);
    });

    // Preview ảnh
    document.getElementById("productImage").addEventListener("change", function () {
        const file = this.files[0];
        if (file) {
            const preview = document.getElementById("productImagePreview");
            preview.src = URL.createObjectURL(file);
            preview.classList.remove("d-none");
        }
    });
});

async function loadProducts(token) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/admin/categories/${categoryId}/products?page=${currentPage}&size=10`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        const result = await response.json();
        if (!response.ok) {
            console.error(result.message);
            return;
        }

        const products = result.data?.content || [];

        renderProducts(products);
        renderPagination(result.data, token);

    } catch (error) {
        console.error("Lỗi khi tải sản phẩm:", error);
    }
}

function renderProducts(products) {
    const tbody = document.getElementById("productsTable");
    const urlParams = new URLSearchParams(window.location.search);
    categoryId = urlParams.get("category");
    const categoryName = urlParams.get("name");

    if (categoryName) {
        document.getElementById("categoryTitle").textContent = decodeURIComponent(categoryName);
    } else if (products.length > 0 && products[0].categoryName) {
        document.getElementById("categoryTitle").textContent = products[0].categoryName;
    }
    if (products.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">Không có sản phẩm nào</td></tr>`;
        return;
    }

    tbody.innerHTML = products.map((product, index) => `
        <tr>
            <td>${index + 1 + (currentPage - 1) * 10}</td>
            <td>
                <div class="d-flex align-items-center gap-3">
                    <img src="${product.imageUrl}" class="rounded border" width="60" height="60"
                        style="object-fit: cover;" alt="${product.productName}">
                    <div>
                        <div class="fw-semibold">${product.productName}</div>
                        <small class="text-muted">${product.categoryName}</small>
                    </div>
                </div>
            </td>
            <td>${new Intl.NumberFormat('vi-VN').format(product.price)} VND</td>
            <td>
                <span class="badge ${product.quantity > 0 ? 'bg-success' : 'bg-danger'}">
                    ${product.quantity}
                </span>
            </td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1"
                    onclick="openProductModal(${JSON.stringify(product).replace(/"/g, '&quot;')})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger"
                    onclick="openDeleteModal(${product.productId}, '${product.productName}')">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join("");
}

function openProductModal(product) {
    const isEdit = product !== null;

    document.getElementById("productModalTitle").textContent = isEdit ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm";
    document.getElementById("editProductId").value = isEdit ? product.productId : "";
    document.getElementById("productName").value = isEdit ? product.productName : "";
    document.getElementById("productPrice").value = isEdit ? product.price : "";
    document.getElementById("productQuantity").value = isEdit ? product.quantity : "";
    document.getElementById("productOrigin").value = isEdit ? (product.origin || "") : "";
    document.getElementById("productAdvantages").value = isEdit ? (product.advantages || "") : "";

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

async function saveProduct(token) {
    const productId = document.getElementById("editProductId").value;
    const isEdit = !!productId;

    const data = {
        productName: document.getElementById("productName").value.trim(),
        price: parseFloat(document.getElementById("productPrice").value),
        stockQuantity: parseInt(document.getElementById("productQuantity").value),
        origin: document.getElementById("productOrigin").value.trim(),
        advantages: document.getElementById("productAdvantages").value.trim(),
        categoryId: parseInt(categoryId)
    };

    const imageFile = document.getElementById("productImage").files[0];

    if (!data.productName || !data.price || !data.stockQuantity) {
        alert("Vui lòng nhập đầy đủ thông tin bắt buộc");
        return;
    }

    if (!isEdit && !imageFile) {
        alert("Vui lòng chọn hình ảnh cho sản phẩm mới");
        return;
    }

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(data)], { type: "application/json" }));
    if (imageFile) formData.append("image", imageFile);

    try {
        const url = isEdit
            ? `http://localhost:8080/api/admin/products/${productId}`
            : "http://localhost:8080/api/admin/product";

        const method = isEdit ? "PUT" : "POST";

        const response = await fetch(url, {
            method,
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });

        const result = await response.json();
        if (response.ok) {
            alert(isEdit ? "Cập nhật sản phẩm thành công" : "Thêm sản phẩm thành công");
            bootstrap.Modal.getInstance(document.getElementById("productModal")).hide();
            await loadProducts(token);
        } else {
            alert(result.message || "Lưu sản phẩm thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi lưu sản phẩm:", error);
    }
}

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
        const response = await fetch(`http://localhost:8080/api/admin/products/${productId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await response.json();
        if (response.ok) {
            alert("Xóa sản phẩm thành công");
            bootstrap.Modal.getInstance(document.getElementById("deleteProductModal")).hide();
            await loadProducts(token);
        } else {
            alert(result.message || "Xóa sản phẩm thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
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
    prev.onclick = async () => { currentPage = current - 1; await loadProducts(token); };
    container.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = `btn btn-sm ${i === current ? "btn-primary" : "btn-outline-primary"}`;
        btn.textContent = i;
        btn.onclick = async () => { currentPage = i; await loadProducts(token); };
        container.appendChild(btn);
    }

    const next = document.createElement("button");
    next.className = "btn btn-sm btn-outline-secondary";
    next.textContent = "›";
    next.disabled = current >= totalPages;
    next.onclick = async () => { currentPage = current + 1; await loadProducts(token); };
    container.appendChild(next);
}