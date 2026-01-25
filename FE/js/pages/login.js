document.addEventListener("DOMContentLoaded", () => {
    initLogin();
});

function initLogin() {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", handleLogin);
}

function handleLogin(e){
    e.preventDefault(); // Ngăn form submit mặc định

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if(!email || !password){
        alert("Vui lòng nhập đầy đủ thông tin");
        return;
    }
    
    if(email === "test@gmail.com" && password === "123456"){
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        alert("Đăng nhập thành công");
        window.location.href = "../index.html";
    }
    else{
        alert("Sai email hoặc mật khẩu");
    }
}