document.getElementById("resetForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = localStorage.getItem("email");
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Validate input
    if (!email) {
        alert("Email không hợp lệ. Vui lòng thử lại từ đầu.");
        window.location.href = "../../pages/forgot.html";
        return;
    }

    if (!password) {
        alert("Vui lòng nhập mật khẩu mới");
        return;
    }

    if (password.length < 6) {
        alert("Mật khẩu phải có ít nhất 6 ký tự");
        return;
    }

    if (password !== confirmPassword) {
        alert("Mật khẩu xác nhận không trùng khớp");
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/user/reset-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                newPassword: password
            })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message || "Đặt lại mật khẩu thành công");
            localStorage.removeItem("userEmail");
            localStorage.removeItem("otpCountdown");
            localStorage.removeItem("accessToken");
            localStorage.removeItem("role");
            window.location.href = "../../pages/login.html";
        } else {
            alert(result.message || "Không thể đặt lại mật khẩu");
        }
    } catch (error) {
        console.error(error);
        alert("Không thể kết nối server");
    }
});
