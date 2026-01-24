function initSearch() {
    const searchInput = document.querySelector('input[placeholder="Tìm kiếm môn thể thao"]');
    if (!searchInput) return;

    searchInput.addEventListener("keydown", (e) => {
        // console.log(e.key);
        if (e.key === "Enter") {
            const keyword = searchInput.value.trim();
            console.log("Searching for:", keyword);
            if (keyword === "") {
                alert("Vui lòng nhập từ khóa tìm kiếm");
                return;
            }

            // Demo: chuyển trang search
            window.location.href = `pages/product-list.html?search=${encodeURIComponent(keyword)}`;
        }
    });
}

function initCart() {
    // Lấy span hiển thị số lượng trong giỏ hàng
    const cartBadge = document.querySelector(".bi-cart + span");

    if (!cartBadge) return;

    let cartCount = localStorage.getItem("cartCount") || 2;
    cartBadge.innerText = cartCount;
}

// function addToCart() {
//     let count = Number(localStorage.getItem("cartCount") || 0);
//     count++;

//     localStorage.setItem("cartCount", count);
//     initCart(); // cập nhật lại badge
// }
