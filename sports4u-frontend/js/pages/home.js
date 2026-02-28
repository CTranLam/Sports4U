document.addEventListener("DOMContentLoaded", async () => {
    await loadCategories();
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get("error");
    if (error) {
        alert("Thanh toán thất bại. Vui lòng thử lại.");
        history.replaceState({}, '', window.location.pathname);
    }else if(urlParams.get("success") === "true"){
        alert("Thanh toán VNPay thành công! Đơn hàng của bạn đã được xác nhận.");
        history.replaceState({}, '', window.location.pathname);
    }
});

async function loadCategories() {
    try {
        const response = await fetch("http://localhost:8080/api/categories", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error("Lỗi khi lấy danh sách categories");
            return;
        }

        const result = await response.json();
        const categories = result.data?.categories || [];

        const mainContent = document.getElementById("main-content");
        mainContent.innerHTML = "";
        console.log("Loaded categories:", categories);

        for (const category of categories) {
            // Fetch products của category này
            const productsResponse = await fetch(`http://localhost:8080/api/categories/${category.categoryId}/products?page=1&size=4`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json"
                }
            });

            if (!productsResponse.ok) continue;

            const productsResult = await productsResponse.json();
            const topProducts = productsResult.data?.content || [];

            // Render section cho category
            const section = document.createElement("section");
            section.className = "mb-5";

            let sectionHTML = `
                <div class="d-flex justify-content-between align-items-center mb-3">
                    <h4 class="mb-0">${category.categoryName}</h4>
                    <a href="pages/product-list.html?category=${category.categoryId}" class="text-decoration-none small">
                        Xem tất cả
                    </a>
                </div>
                <div class="row g-3">
            `;

            // Render products
            topProducts.forEach(product => {
                sectionHTML += `
                    <div class="col-lg-3 col-md-4 col-sm-6">
                        <a href="pages/product-detail.html?id=${product.productId}" class="text-decoration-none text-dark h-100 d-block">
                            <div class="card border-0 bg-secondary bg-opacity-10 p-3 h-100">
                                <img src="${product.imageUrl}" class="img-fluid mb-3" alt="${product.productName}">
                                <p class="mb-1 small fw-semibold">${product.productName}</p>
                                <p class="text-muted small mb-0">
                                    ${new Intl.NumberFormat('vi-VN').format(product.price || 0)} VND
                                </p>
                            </div>
                        </a>
                    </div>
                `;
            });

            sectionHTML += `</div>`;

            section.innerHTML = sectionHTML;
            mainContent.appendChild(section);
        }
    } catch (error) {
        console.error("Lỗi khi load categories:", error);
    }
}



