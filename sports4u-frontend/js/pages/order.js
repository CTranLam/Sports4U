let currentStatus = "ALL";
let currentPage = 1;

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "../../pages/login.html";
        return;
    }

    await loadOrders(token);

    document.querySelectorAll("#orderTabs .nav-link").forEach(tab => {
        tab.addEventListener("click", async function () {
            document.querySelectorAll("#orderTabs .nav-link").forEach(t => t.classList.remove("active"));
            this.classList.add("active");
            currentStatus = this.dataset.status;
            currentPage = 1;
            await loadOrders(token);
        });
    });
});

async function loadOrders(token) {
    try {
        const statusParam = currentStatus !== "ALL" ? `&status=${currentStatus}` : "";

        const response = await fetch(
            `http://localhost:8080/api/user/orders?page=${currentPage}&size=5${statusParam}`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        const result = await response.json();
        if (!response.ok) {
            console.error(result.message);
            return;
        }

        const orders = result.data?.content || [];
        renderOrders(orders);
        renderPagination(result.data, token);

    } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
    }
}

function renderOrders(orders) {
    const container = document.getElementById("orderList");

    if (orders.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted py-5">
                <i class="bi bi-receipt fs-1"></i>
                <p class="mt-2">Không có đơn hàng nào</p>
            </div>`;
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-item mb-4">
            <div class="card border-0 shadow-sm">
                <div class="card-header bg-light py-3 px-4 border-bottom">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <h6 class="mb-0 fw-semibold">Đơn hàng #${order.orderId}</h6>
                            <small class="text-muted">Ngày đặt: ${formatDate(order.orderDate)}</small>
                        </div>
                        <div class="col-md-6 text-md-end">
                            ${renderStatusBadge(order.status)}
                        </div>
                    </div>
                </div>

                <div class="card-footer bg-white py-3 px-4">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <p class="mb-0">
                                <span class="text-muted">Tổng cộng:</span>
                                <span class="fw-semibold fs-5 ms-1">
                                    ${new Intl.NumberFormat('vi-VN').format(order.totalAmount)} VND
                                </span>
                            </p>
                        </div>
                        <div class="col-md-6 text-md-end d-flex gap-2 justify-content-md-end mt-2 mt-md-0">
                            <button class="btn btn-outline-dark btn-sm" onclick="openOrderDetail(${order.orderId})">
                                Xem chi tiết
                            </button>
                            ${order.status === "PENDING" ? `
                                <button class="btn btn-outline-danger btn-sm" onclick="cancelOrder(${order.orderId})">
                                    Hủy đơn
                                </button>` : ""}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join("");
}

function renderStatusBadge(status) {
    const map = {
        "PENDING":   { label: "Chờ xác nhận", cls: "bg-warning text-dark" },
        "CONFIRMED": { label: "Đã xác nhận",  cls: "bg-primary" },
        "SHIPPING":   { label: "Đang vận chuyển", cls: "bg-info" },
        "COMPLETED": { label: "Hoàn thành",   cls: "bg-success" },
        "CANCELLED": { label: "Đã hủy",       cls: "bg-danger" },
    };
    const s = map[status] || { label: status, cls: "bg-secondary" };
    return `<span class="badge ${s.cls}">${s.label}</span>`;
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
}

async function openOrderDetail(orderId) {
    const token = localStorage.getItem("accessToken");
    try {
        const response = await fetch(`http://localhost:8080/api/user/orders/${orderId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await response.json();
        if (!response.ok) {
            alert(result.message);
            return;
        }

        const order = result.data;

        document.getElementById("modalOrderId").textContent = `#${order.orderId}`;
        document.getElementById("modalOrderDate").textContent = formatDate(order.orderDate);
        document.getElementById("modalOrderStatus").innerHTML = renderStatusBadge(order.status);
        document.getElementById("modalReceiver").textContent = order.receiverName || "Chưa cập nhật";
        document.getElementById("modalPhone").textContent = order.receiverPhone || "Chưa cập nhật";
        document.getElementById("modalAddress").textContent = order.fullAddress || "Chưa cập nhật";
        document.getElementById("modalTotal").textContent = `${new Intl.NumberFormat('vi-VN').format(order.totalAmount)} VND`;

        document.getElementById("modalOrderItems").innerHTML = order.items.map(item => `
            <div class="d-flex align-items-center gap-3">
                <img src="${item.thumbnail}" width="70" class="rounded" alt="${item.productName}">
                <div class="flex-grow-1">
                    <p class="mb-1 fw-semibold">${item.productName}</p>
                    <small class="text-muted">Số lượng: ${item.quantity}</small>
                    <p class="mb-0 text-danger fw-semibold">
                        ${new Intl.NumberFormat('vi-VN').format(item.subtotal)} VND
                    </p>
                </div>
            </div>
        `).join("");

        new bootstrap.Modal(document.getElementById("orderDetailModal")).show();

    } catch (error) {
        console.error("Lỗi khi tải chi tiết đơn hàng:", error);
    }
}

async function cancelOrder(orderId) {
    if (!confirm("Bạn có chắc muốn hủy đơn hàng này không?")) return;

    const token = localStorage.getItem("accessToken");
    try {
        const response = await fetch(`http://localhost:8080/api/user/orders/${orderId}/cancel`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const result = await response.json();
        if (response.ok) {
            alert("Hủy đơn hàng thành công");
            await loadOrders(token);
        } else {
            alert(result.message || "Không thể hủy đơn hàng");
        }
    } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
    }
}

function renderPagination(pageData, token) {
    const container = document.getElementById("paginationContainer");
    if (!container) return;

    container.innerHTML = "";

    const totalPages = pageData?.totalPages ?? 1;
    const currentZeroBased = pageData?.pageNumber ?? 0;
    const current = currentZeroBased + 1; 

    const prev = document.createElement("button");
    prev.className = "btn btn-sm btn-outline-secondary";
    prev.textContent = "‹";
    prev.disabled = current === 1;
    prev.onclick = async () => { currentPage = current - 1; await loadOrders(token); };
    container.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = `btn btn-sm ${i === current ? "btn-primary" : "btn-outline-primary"}`;
        btn.textContent = i;
        btn.onclick = async () => { currentPage = i; await loadOrders(token); };
        container.appendChild(btn);
    }

    const next = document.createElement("button");
    next.className = "btn btn-sm btn-outline-secondary";
    next.textContent = "›";
    next.disabled = current >= totalPages;
    next.onclick = async () => { currentPage = current + 1; await loadOrders(token); };
    container.appendChild(next);
}