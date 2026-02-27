document.getElementById("registerForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const retypePassword = document.getElementById("confirmPassword").value;
    const errorMsg = document.getElementById("errorMsg");

    errorMsg.textContent = "";

    if (password !== retypePassword) {
        errorMsg.textContent = "Mật khẩu xác nhận không khớp";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/user/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password, retypePassword })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            window.location.href = "../../pages/login.html";
        } else {
            errorMsg.textContent = result.message || "Đăng ký thất bại";
        }

    } catch (error) {
        console.error(error);
        errorMsg.textContent = "Không thể kết nối server";
    }
});