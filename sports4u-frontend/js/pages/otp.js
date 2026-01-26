document.addEventListener("DOMContentLoaded", () => {
    bindOtpEvent();
});

function bindOtpEvent() {
    const form = document.getElementById("otpForm");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const otp = document.getElementById("otp").value.trim();
        if (otp.length !== 6) {
            alert("Mã OTP phải gồm 6 chữ số");
            return;
        }

        // Giả lập verify OTP
        console.log("OTP nhập:", otp);

        // Thành công → sang trang đặt lại mật khẩu
        window.location.href = "reset-password.html";
    });
}
