document.getElementById("loginForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const response = await fetch("http://localhost:8080/api/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            const token = result.data.token;

            localStorage.setItem("accessToken", token);
            localStorage.setItem("userEmail", result.data.email);
            localStorage.setItem("role", result.data.role);
            localStorage.setItem("isLoggedIn", "true");

            alert(result.message);
            window.location.href = "../../index.html";
        } else {
            alert(result.message || "Sai email hoặc mật khẩu");
        }

    } catch (error) {
        console.error(error);
        alert("Không thể kết nối server");
    }
});