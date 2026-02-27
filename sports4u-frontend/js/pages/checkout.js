document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "../../pages/login.html";
        return;
    }
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error) {
        alert("Thanh toán thất bại. Vui lòng thử lại.");
        history.replaceState({}, '', window.location.pathname);
    }

    const buyNowItem = sessionStorage.getItem("buyNowItem");
    const selectedItems = sessionStorage.getItem("selectedCartItems");

    if (buyNowItem) {
        await previewFromProduct(JSON.parse(buyNowItem), token);
    } else if (selectedItems) {
        await previewFromCart(JSON.parse(selectedItems), token);
    } else {
        if (!error) {
            alert("Không có sản phẩm nào để đặt hàng");
            window.location.href = "../../pages/cart.html";
        }
    }
});

// Preview từ trang product detail (mua ngay)
async function previewFromProduct(item, token) {
    try {
        const response = await fetch("http://localhost:8080/api/user/order/preview-from-product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: item.productId,
                quantity: item.quantity
            })
        });

        const result = await response.json();
        if (!response.ok) {
            alert(result.message || "Không thể tải thông tin đơn hàng");
            return;
        }

        renderPreview([result.data]);

        // Gắn sự kiện đặt hàng
        document.getElementById("confirmBtn").addEventListener("click", async () => {
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            await checkoutFromProduct(item.productId, item.quantity, paymentMethod, token);
        });

    } catch (error) {
        console.error("Lỗi preview từ product:", error);
    }
}

// Preview từ cart
async function previewFromCart(productIds, token) {
    try {
        const response = await fetch("http://localhost:8080/api/user/order/cart/list-item", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ itemIds: productIds })
        });

        const result = await response.json();
        if (!response.ok) {
            alert(result.message || "Không thể tải thông tin đơn hàng");
            return;
        }

        renderPreview(result.data);

        // Gắn sự kiện đặt hàng
        document.getElementById("confirmBtn").addEventListener("click", async () => {
            const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;
            await checkoutFromCart(productIds, paymentMethod, token);
        });

    } catch (error) {
        console.error("Lỗi preview từ cart:", error);
    }
}

function renderPreview(items) {
    const tbody = document.getElementById("orderItemsBody");
    let subtotal = 0;

    tbody.innerHTML = items.map(item => {
        subtotal += parseFloat(item.subtotal);
        return `
            <tr>
                <td>
                    <div class="d-flex align-items-center gap-2">
                        <img src="${item.imageUrl}" width="50" class="rounded" alt="${item.productName}">
                        <span class="fw-semibold">${item.productName}</span>
                    </div>
                </td>
                <td class="text-center">${item.quantity}</td>
                <td class="text-end">${new Intl.NumberFormat('vi-VN').format(item.subtotal)} VND</td>
            </tr>
        `;
    }).join("");

    document.getElementById("subtotalPrice").textContent =
        `${new Intl.NumberFormat('vi-VN').format(subtotal)} VND`;
    document.getElementById("totalPrice").textContent =
        `${new Intl.NumberFormat('vi-VN').format(subtotal)} VND`;

    // Hiển thị thông tin người nhận từ item đầu tiên
    const first = items[0];
    if (first) {
        document.getElementById("receiverName").textContent = first.fullName || "Chưa cập nhật";
        document.getElementById("receiverPhone").textContent = first.phone || "Chưa cập nhật";
        document.getElementById("deliveryAddress").textContent = first.fullAddress || "Chưa cập nhật địa chỉ";
    }
}

async function checkoutFromProduct(productId, quantity, paymentMethod, token) {
    try {
        const response = await fetch("http://localhost:8080/api/user/order/checkout/from-product", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ productId, quantity, paymentMethod })
        });

        const result = await response.json();
        if (response.ok) {
            sessionStorage.removeItem("buyNowItem");
            handlePostCheckout(result.data, paymentMethod, token);
        } else {
            alert(result.message || "Đặt hàng thất bại");
        }
    } catch (error) {
        console.error("Lỗi checkout từ product:", error);
    }
}

async function checkoutFromCart(productIds, paymentMethod, token) {
    try {
        const response = await fetch("http://localhost:8080/api/user/order/checkout/from-cart", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ cartItemIds: productIds, paymentMethod })
        });

        const result = await response.json();
        if (response.ok) {
            sessionStorage.removeItem("selectedCartItems");
            handlePostCheckout(result.data, paymentMethod, token);
        } else {
            alert(result.message || "Đặt hàng thất bại");
        }
    } catch (error) {
        console.error("Lỗi checkout từ cart:", error);
    }
}

async function handlePostCheckout(order, paymentMethod, token) {
    if (paymentMethod === "VNPAY") {
        try {
            const response = await fetch(`http://localhost:8080/api/user/order/payment/vnpay/${order.orderId}`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const result = await response.json();
            if (response.ok) {
                window.location.href = result.data.paymentUrl; 
            }
        } catch (error) {
            console.error("Lỗi tạo link VNPay:", error);
            window.location.href = "../../pages/delivery.html";
        }
    } else {
        alert("Đặt hàng thành công!");
        sessionStorage.removeItem("buyNowItem");
        sessionStorage.removeItem("selectedCartItems");
        window.location.href = "../../index.html";
    }
}