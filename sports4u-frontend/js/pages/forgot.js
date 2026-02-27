document.getElementById("forgotForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    try {
        const response = await fetch("http://localhost:8080/api/user/forgot-password", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email })
        });

        const result = await response.json();

        if (response.ok) {
            alert(result.message);
            localStorage.setItem("email", email);
            
            // Lưu thời gian countdown (data trả về là số phút, convert sang giây)
            const countdownSeconds = result.data * 60;
            localStorage.setItem("otpCountdown", countdownSeconds);
            
            window.location.href = "../../pages/confirm-otp.html";

        } else {
            alert(result.message || "Không thể gửi OTP");
        }

    } catch (error) {
        console.error(error);
        alert("Không thể kết nối server");
    }
});