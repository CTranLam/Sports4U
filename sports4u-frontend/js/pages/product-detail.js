document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        console.error("Không tìm thấy productId");
        return;
    }

    await loadProductDetail(productId);

    // Quantity buttons
    const quantityInput = document.getElementById("quantityInput");
    document.getElementById("decreaseBtn").addEventListener("click", () => {
        const val = parseInt(quantityInput.value);
        if (val > 1) quantityInput.value = val - 1;
    });
    document.getElementById("increaseBtn").addEventListener("click", () => {
        const val = parseInt(quantityInput.value);
        if (val < 10) quantityInput.value = val + 1;
    });
});

async function loadProductDetail(productId) {
    try {
        const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) {
            console.error("Lỗi khi lấy thông tin sản phẩm");
            return;
        }

        const result = await response.json();
        const product = result.data;

        // Render thông tin sản phẩm
        document.getElementById("productImage").src = product.imageUrl;
        document.getElementById("productImage").alt = product.productName;
        document.getElementById("productName").textContent = product.productName;
        document.getElementById("productStock").textContent = product.inStock ? product.quantity : 0;
        document.getElementById("productPrice").textContent =
            `${new Intl.NumberFormat('vi-VN').format(product.price || 0)} VND`;
        document.getElementById("productDesc").textContent =
            `Xuất xứ: ${product.origin} — ${product.advantages}`;

        const stockEl = document.getElementById("productStock");
        if (!product.inStock) {
            stockEl.closest("span.text-success").className = "text-danger fw-semibold";
            stockEl.parentElement.innerHTML = `<span class="text-danger fw-semibold">Hết hàng</span>`;
            document.getElementById("buyNowBtn").disabled = true;
            document.getElementById("addToCartBtn").disabled = true;
        }

        // Gắn sự kiện mua hàng
        document.getElementById("addToCartBtn").addEventListener("click", () => {
            const quantity = parseInt(document.getElementById("quantityInput").value);
            addToCart(product, quantity);
        });

        document.getElementById("buyNowBtn").addEventListener("click", () => {
            const quantity = parseInt(document.getElementById("quantityInput").value);

            // Lưu tạm sản phẩm mua ngay vào sessionStorage (không ảnh hưởng giỏ hàng)
            const buyNowItem = {
                productId: product.productId,
                productName: product.productName,
                price: product.price,
                imageUrl: product.imageUrl,
                quantity: quantity
            };
            sessionStorage.setItem("buyNowItem", JSON.stringify(buyNowItem));
            window.location.href = "../../pages/delivery.html";
        });

    } catch (error) {
        console.error("Lỗi khi load chi tiết sản phẩm:", error);
    }
}

async function addToCart(product, quantity) {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        alert("Vui lòng đăng nhập để thêm vào giỏ hàng");
        window.location.href = "./login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/user/cart/items", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                productId: product.productId,
                quantity: quantity
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Đã thêm vào giỏ hàng");
        } else {
            alert(result.message || "Không thể thêm vào giỏ hàng");
        }
    } catch (error) {
        console.error(error);
        alert("Không thể kết nối server");
    }
}