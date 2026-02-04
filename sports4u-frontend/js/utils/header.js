document.addEventListener("DOMContentLoaded", () => {
    initAuthUI();
    initLogout();
    initCart();
    initAuthGuard();
    initHeaderScrollEffect();
});

function initAuthUI() {
    const authButtons = document.getElementById("auth-buttons");
    const logoutBtn = document.getElementById("logoutBtn");

    if (!authButtons || !logoutBtn) return;

    const isLoggedIn = localStorage.getItem("isLoggedIn");

    if (isLoggedIn) {
        authButtons.classList.add("d-none");
        logoutBtn.classList.remove("d-none");
    } 
    else {
        authButtons.classList.remove("d-none");
        logoutBtn.classList.add("d-none");
    }
}

function initLogout(){
    const logoutBtn = document.getElementById("logoutBtn");
    if(!logoutBtn) return;

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userEmail");

        window.location.href = "../index.html";
    });
}

function initCart() {
    // Lấy span hiển thị số lượng trong giỏ hàng
    const cartBadge = document.querySelector(".bi-cart + span");

    if (!cartBadge) return;

    let cartCount = localStorage.getItem("cartCount") || 2;
    cartBadge.innerText = cartCount;
}

function initAuthGuard() {
    //css attribute selector 
    const profileLink = document.querySelector('a[href="./profile.html"]');
    // console.log(profileLink);
    profileLink?.addEventListener("click", (e) => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        if (!isLoggedIn) {
            e.preventDefault(); // ngăn chuyển trang giữ user ở trang hiện tại
            alert("Vui lòng đăng nhập");
        }
    });
}
