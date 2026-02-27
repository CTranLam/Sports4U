document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');

    if (!categoryId) {
        console.error("Không tìm thấy categoryId");
        return;
    }

    await loadProductsByCategory(categoryId); 
});

async function loadProductsByCategory(categoryId) {
    try {
        const size = 1;
        const urlParams = new URLSearchParams(window.location.search);
        const page = parseInt(urlParams.get('page')) || 1;

        const response = await fetch(`http://localhost:8080/api/categories/${categoryId}/products?page=${page}&size=${size}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error("Lỗi khi lấy danh sách sản phẩm");
            return;
        }

        const result = await response.json();
        const products = result.data?.content || [];
        const categoryName = products[0]?.categoryName || "Sản phẩm";
        const categoryTitle = document.querySelector("h3.fw-semibold");
        if (categoryTitle) {
            categoryTitle.textContent = categoryName;
        }

        // Lấy container chứa sản phẩm
        const productContainer = document.querySelector(".row.g-4");
        productContainer.innerHTML = "";

        products.forEach(product => {
            const priceText = `${new Intl.NumberFormat('vi-VN').format(product.price || 0)} VND`;
            const productHTML = `
                <div class="col-lg-3 col-md-4 col-sm-6">
                    <a href="product-detail.html?id=${product.productId}" class="text-decoration-none text-dark h-100 d-block">
                        <div class="card border-0 bg-secondary bg-opacity-10 p-3 h-100">
                            <img src="${product.imageUrl}" class="img-fluid mb-3" alt="${product.productName}">
                            <p class="mb-1 small fw-semibold">${product.productName}</p>
                            <p class="text-muted small mb-0">${priceText}</p>
                        </div>
                    </a>
                </div>
            `;
            productContainer.insertAdjacentHTML("beforeend", productHTML);
        });
        renderPagination(result.data, categoryId);

    } catch (error) {
        console.error("Lỗi khi load sản phẩm theo category:", error);
    }
}

function renderPagination(pageData, categoryId) {
    const container = document.getElementById('paginationContainer');
    if (!container) return;

    container.innerHTML = '';

    const totalPages = pageData?.totalPages ?? 1;
    const currentPage = pageData?.pageNumber ?? 1; 

    // Previous
    const prev = document.createElement('button');
    prev.className = 'btn btn-sm btn-outline-secondary';
    prev.textContent = '‹';
    prev.disabled = currentPage === 1;
    prev.onclick = () => changePage(currentPage - 1);
    container.appendChild(prev);

    // Page buttons
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `btn btn-sm ${i === currentPage ? 'btn-primary' : 'btn-outline-primary'}`;
        btn.textContent = i.toString();
        btn.onclick = () => changePage(i);
        container.appendChild(btn);
    }

    // Next
    const next = document.createElement('button');
    next.className = 'btn btn-sm btn-outline-secondary';
    next.textContent = '›';
    next.disabled = currentPage >= totalPages;
    next.onclick = () => changePage(currentPage + 1);
    container.appendChild(next);

    function changePage(page) {
        const params = new URLSearchParams(window.location.search);
        params.set('category', categoryId);
        params.set('page', page);
        history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
        loadProductsByCategory(categoryId);
    }
}
