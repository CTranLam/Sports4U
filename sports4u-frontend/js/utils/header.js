document.addEventListener("DOMContentLoaded", () => {
    initAuthUI();
    initAuthState();
    initLogout();
    initCart();
    initAuthGuard();
});

function initAuthUI() {
    const authButtons = document.getElementById("auth-buttons");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!authButtons || !logoutBtn) return;

    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
        authButtons.classList.add("d-none");
        logoutBtn.classList.remove("d-none");
    } 
    else {
        authButtons.classList.remove("d-none");
        logoutBtn.classList.add("d-none");
    }
}

function initAuthState() {
    const accessToken = localStorage.getItem("accessToken");

    const authOnlyElements = document.querySelectorAll("[data-auth='auth-only']");
    const guestOnlyElements = document.querySelectorAll("[data-auth='guest-only']");
    
    if (accessToken) {
        authOnlyElements.forEach(el => el.classList.remove("d-none"));
        guestOnlyElements.forEach(el => el.classList.add("d-none"));
    } else {
        // Chưa đăng nhập: hiển thị guest-only, ẩn auth-only
        authOnlyElements.forEach(el => el.classList.add("d-none"));
        guestOnlyElements.forEach(el => el.classList.remove("d-none"));
    }
}

function initLogout(){
    const logoutBtn = document.getElementById("logoutBtn");
    if(!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
        localStorage.removeItem("isLoggedIn");

        window.location.href = "../index.html";
    });
}

async function initCart() {
    // Lấy span hiển thị số lượng trong giỏ hàng
    const cartBadge = document.querySelector(".bi-cart + span");

    if (!cartBadge) return;

    const accessToken = localStorage.getItem("accessToken");

    // Nếu chưa đăng nhập, hiển thị 0
    if (!accessToken) {
        cartBadge.innerText = 0;
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/user/cart/count", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });
        const result = await response.json();

        if (response.ok) {
            const count = result.data || 0;
            cartBadge.innerText = count;
        } 
        else {
            console.error(result.message);
            cartBadge.innerText = 0;
        }
    } catch (error) {
        console.error(error);
        cartBadge.innerText = 0;
    }
}

function initAuthGuard() {
    const accessToken = localStorage.getItem("accessToken");
    
    // Danh sách các trang yêu cầu đăng nhập
    const protectedPages = ["profile.html", "orders.html", "cart.html"];
    const currentPage = window.location.pathname;
    
    // Kiểm tra nếu trang hiện tại là trang bảo vệ
    const isProtectedPage = protectedPages.some(page => currentPage.includes(page));
    
    if (isProtectedPage && !accessToken) {
        alert("Vui lòng đăng nhập để truy cập trang này");
        window.location.href = "./login.html";
        return;
    }
    
    // Cũng bảo vệ khi click vào profile link
    const profileLink = document.querySelector('a[href="./profile.html"]');
    profileLink?.addEventListener("click", (e) => {
        if (!accessToken) {
            e.preventDefault();
            alert("Vui lòng đăng nhập");
        }
    });
}
