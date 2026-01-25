// Load html element và Dom được tạo thì khởi chạy các hàm khởi tạo
document.addEventListener("DOMContentLoaded", () => {
    initSearch();
    initAuthGuard();
});


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
            window.location.href = `pages/product-list.html?search=${encodeURIComponent(keyword)}`;
        }
    });
}


// function addToCart() {
//     let count = Number(localStorage.getItem("cartCount") || 0);
//     count++;

//     localStorage.setItem("cartCount", count);
//     initCart(); // cập nhật lại badge
// }

function initAuthGuard() {
    //css attribute selector 
    const profileLink = document.querySelector('a[href="./pages/profile.html"]');
    // console.log(profileLink);
    profileLink?.addEventListener("click", (e) => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            e.preventDefault(); // ngăn chuyển trang giữ user ở trang hiện tại
            alert("Vui lòng đăng nhập");
        }
    });
}


