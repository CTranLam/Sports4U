let currentPage = 1;
let currentStatus = "";
let currentPaymentStatus = "";
let cachedToken = null;

const STATUS_MAP = {
    PENDING:   { label: "Chờ xác nhận",    cls: "bg-warning text-dark" },
    CONFIRMED: { label: "Đã xác nhận",     cls: "bg-primary" },
    SHIPPING:  { label: "Đang vận chuyển", cls: "bg-info" },
    COMPLETED: { label: "Hoàn thành",      cls: "bg-success" },
    CANCELLED: { label: "Đã hủy",          cls: "bg-danger" },
};

const PAYMENT_STATUS_MAP = {
    PAID:   { label: "Đã thanh toán",   cls: "bg-success" },
    UNPAID: { label: "Chưa thanh toán", cls: "bg-danger" },
};

const PAYMENT_METHOD_MAP = {
    VNPAY: { label: "VNPay", icon: "bi-credit-card" },
    COD:   { label: "COD",   icon: "bi-cash-coin" },
    MOMO:  { label: "MoMo",  icon: "bi-phone" },
};

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"];

document.addEventListener("DOMContentLoaded", async () => {
    cachedToken = localStorage.getItem("accessToken");
    if (!cachedToken) {
        window.location.href = "../../pages/login.html";
        return;
    }

    await loadOrders();

    document.getElementById("statusFilter").addEventListener("change", async function () {
        currentStatus = this.value;
        currentPage = 1;
        await loadOrders();
    });

    document.getElementById("paymentStatusFilter").addEventListener("change", async function () {
        currentPaymentStatus = this.value;
        currentPage = 1;
        await loadOrders();
    });
});

async function loadOrders() {
    try {
        const params = new URLSearchParams({ page: currentPage, size: 10 });
        if (currentStatus) params.append("status", currentStatus);
        if (currentPaymentStatus) params.append("paymentStatus", currentPaymentStatus);

        const response = await fetch(
            `http://localhost:8080/api/admin/orders?${params}`,
            { headers: { Authorization: `Bearer ${cachedToken}` } }
        );

        const result = await response.json();
        if (!response.ok) {
            console.error(result.message);
            return;
        }

        renderOrders(result.data?.content || []);
        renderPagination(result.data);

    } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error);
    }
}

function renderOrders(orders) {
    const tbody = document.getElementById("orderTableBody");

    if (orders.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">Không có đơn hàng nào</td></tr>`;
        return;
    }

    tbody.innerHTML = orders.map((order, index) => {
        const status        = STATUS_MAP[order.status]                || { label: order.status,        cls: "bg-secondary" };
        const paymentStatus = PAYMENT_STATUS_MAP[order.paymentStatus] || { label: order.paymentStatus, cls: "bg-secondary" };
        const paymentMethod = PAYMENT_METHOD_MAP[order.paymentMethod] || { label: order.paymentMethod, icon: "bi-question-circle" };

        const dropdownItems = STATUS_OPTIONS.map(s => `
            <li>
                <button class="dropdown-item ${order.status === s ? "active" : ""}"
                    onclick="updateStatus(${order.orderId}, '${s}')">
                    ${STATUS_MAP[s].label}
                </button>
            </li>
        `).join("");

        return `
            <tr>
                <td>${index + 1 + (currentPage - 1) * 10}</td>
                <td class="fw-semibold">#${order.orderId}</td>
                <td>${order.userEmail}</td>
                <td>
                    <small class="text-muted" title="${order.fullAddress || ''}"
                        style="display:inline-block; max-width:160px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
                        ${order.fullAddress || "Chưa cập nhật"}
                    </small>
                </td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-sm ${status.cls} dropdown-toggle" data-bs-toggle="dropdown">
                            ${status.label}
                        </button>
                        <ul class="dropdown-menu">${dropdownItems}</ul>
                    </div>
                </td>
                <td>
                    <span class="d-flex align-items-center gap-1 small">
                        <i class="bi ${paymentMethod.icon}"></i> ${paymentMethod.label}
                    </span>
                </td>
                <td>
                    <span class="badge ${paymentStatus.cls} rounded-pill px-2">
                        ${paymentStatus.label}
                    </span>
                </td>
                <td class="text-nowrap fw-semibold">${new Intl.NumberFormat("vi-VN").format(order.totalAmount)} ₫</td>
                <td class="text-muted small text-nowrap">${formatDate(order.orderDate)}</td>
            </tr>
        `;
    }).join("");
}

async function updateStatus(orderId, status) {
    try {
        const response = await fetch(
            `http://localhost:8080/api/admin/orders/${orderId}/status?status=${status}`,
            {
                method: "PUT",
                headers: { Authorization: `Bearer ${cachedToken}` }
            }
        );

        const result = await response.json();
        if (response.ok) {
            await loadOrders();
        } else {
            alert(result.message || "Cập nhật trạng thái thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
    }
}

function formatDate(dateStr) {
    const d = new Date(dateStr);
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

function renderPagination(pageData) {
    const container = document.getElementById("paginationContainer");
    if (!container) return;
    container.innerHTML = "";

    const totalPages = pageData?.totalPages ?? 1;
    const current    = (pageData?.pageNumber ?? 0) + 1;
    currentPage      = current;

    const prev = document.createElement("button");
    prev.className = "btn btn-sm btn-outline-secondary";
    prev.textContent = "‹";
    prev.disabled = current === 1;
    prev.onclick = async () => { currentPage = current - 1; await loadOrders(); };
    container.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = `btn btn-sm ${i === current ? "btn-dark" : "btn-outline-secondary"}`;
        btn.textContent = i;
        btn.onclick = async () => { currentPage = i; await loadOrders(); };
        container.appendChild(btn);
    }

    const next = document.createElement("button");
    next.className = "btn btn-sm btn-outline-secondary";
    next.textContent = "›";
    next.disabled = current >= totalPages;
    next.onclick = async () => { currentPage = current + 1; await loadOrders(); };
    container.appendChild(next);
}