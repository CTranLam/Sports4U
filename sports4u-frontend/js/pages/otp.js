let countdownInterval;

function startCountdown(seconds) {
    const countdownEl = document.getElementById("countdown");
    const resendBtn = document.getElementById("resendBtn");
    const countdownText = document.getElementById("countdownText");

    if (!countdownEl || !resendBtn) {
        console.error("Countdown elements not found");
        return;
    }

    let timeLeft = seconds;
    resendBtn.disabled = true;
    countdownEl.textContent = timeLeft;

    clearInterval(countdownInterval);

    countdownInterval = setInterval(() => {
        timeLeft--;

        if (timeLeft > 0) {
            countdownEl.textContent = timeLeft;
        } else {
            countdownEl.textContent = "0";
            if (countdownText) countdownText.textContent = "Bạn có thể gửi lại OTP";
            resendBtn.disabled = false;
            clearInterval(countdownInterval);
        }
    }, 1000);
}

document.addEventListener("DOMContentLoaded", function () {
    // Bắt đầu countdown
    startCountdown(localStorage.getItem("otpCountdown") || 0);

    // Xử lý xác nhận OTP
    document.getElementById("otpForm").addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = localStorage.getItem("email");
        const otp = document.getElementById("otp").value.trim();

        if (!email) {
            alert("Email không hợp lệ. Vui lòng thử lại.");
            window.location.href = "../../pages/forgot.html";
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/user/verify-otp", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, otp })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "OTP hợp lệ");
                localStorage.setItem("resetToken", result.token || "");
                window.location.href = "../../pages/reset-password.html";
            } else {
                alert(result.message || "Mã OTP không hợp lệ");
            }
        } catch (error) {
            console.error(error);
            alert("Không thể kết nối server");
        }
    });

    // Xử lý gửi lại OTP
    document.getElementById("resendBtn").addEventListener("click", async function () {
        const email = localStorage.getItem("email");
        const resendBtn = document.getElementById("resendBtn");

        if (!email) {
            alert("Email không hợp lệ");
            return;
        }

        resendBtn.disabled = true;

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
                const countdownSeconds = result.data * 60;
                localStorage.setItem("otpCountdown", countdownSeconds);
                document.getElementById("otp").value = "";
                document.getElementById("countdownText").innerHTML =
                    'Bạn có thể gửi lại sau <span id="countdown" class="fw-bold">--</span> giây';
                startCountdown(countdownSeconds);
                alert(result.message || "Mã OTP mới đã được gửi");
            } else {
                alert(result.message || "Không thể gửi lại OTP");
                resendBtn.disabled = false;
            }
        } catch (error) {
            console.error(error);
            alert("Không thể kết nối server");
            resendBtn.disabled = false;
        }
    });
});
