document.addEventListener("DOMContentLoaded", async () => {
    await loadCart();

    document.getElementById("checkAll").addEventListener("change", function () {
        document.querySelectorAll(".item-check").forEach(cb => cb.checked = this.checked);
        updateSummary();
    });
});

async function loadCart() {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "./login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/user/cart", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const result = await response.json();
        if (!response.ok) {
            console.error(result.message);
            return;
        }

        renderCart(result.data || []);

    } catch (error) {
        console.error("Lỗi khi tải giỏ hàng:", error);
    }
}

function renderCart(items) {
    const container = document.getElementById("cartContainer");

    if (items.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-5">
                <i class="bi bi-cart-x fs-1"></i>
                <p class="mt-2">Giỏ hàng trống</p>
                <a href="../index.html" class="btn btn-dark btn-sm">Tiếp tục mua sắm</a>
            </div>`;
        return;
    }

    container.innerHTML = items.map(item => `
        <div class="card mb-3 cart-item" data-id="${item.productId}" data-price="${item.price}" data-quantity="${item.quantity}">
            <div class="row g-0 align-items-center">
                <div class="col-1 text-center">
                    <input class="form-check-input item-check" type="checkbox" data-id="${item.productId}" data-price="${item.price}" data-quantity="${item.quantity}">
                </div>
                <div class="col-3">
                    <img src="${item.imageUrl}" class="img-fluid p-2" alt="${item.productName}">
                </div>
                <div class="col-6">
                    <h6 class="mb-1">${item.productName}</h6>
                    <small class="text-muted">Số lượng: ${item.quantity}</small>
                    <span class="d-block mt-1 text-danger fw-semibold">
                        ${new Intl.NumberFormat('vi-VN').format(item.price * item.quantity)} VND
                    </span>
                </div>
                <div class="col-2 text-end pe-3">
                    <button class="btn btn-outline-danger btn-sm btn-remove" data-id="${item.productId}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join("");

    // Gắn event xóa
    document.querySelectorAll(".btn-remove").forEach(btn => {
        btn.addEventListener("click", async function () {
            const productId = this.dataset.id;
            await removeItem(productId);
        });
    });

    // Gắn event checkbox
    document.querySelectorAll(".item-check").forEach(cb => {
        cb.addEventListener("change", updateSummary);
    });
}

async function removeItem(productId) {
    const token = localStorage.getItem("accessToken");

    try {
        const response = await fetch(`http://localhost:8080/api/user/cart/items/${productId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await response.json();
        if (response.ok) {
            await loadCart();
        } else {
            alert(result.message || "Không thể xóa sản phẩm");
        }
    } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
    }
}

function updateSummary() {
    const checked = document.querySelectorAll(".item-check:checked");
    let total = 0;

    checked.forEach(cb => {
        total += parseFloat(cb.dataset.price) * parseInt(cb.dataset.quantity);
    });

    document.getElementById("selectedCount").textContent = checked.length;
    document.getElementById("totalPrice").textContent =
        `${new Intl.NumberFormat('vi-VN').format(total)} VND`;
    document.getElementById("checkoutBtn").disabled = checked.length === 0;

    const allChecks = document.querySelectorAll(".item-check");
    document.getElementById("checkAll").checked =
        allChecks.length > 0 && checked.length === allChecks.length;
}

document.getElementById("checkoutBtn").addEventListener("click", () => {
    const checked = document.querySelectorAll(".item-check:checked");
    const productIds = Array.from(checked).map(cb => parseInt(cb.dataset.id));
    sessionStorage.setItem("selectedCartItems", JSON.stringify(productIds));
    window.location.href = "../../pages/delivery.html";
});