document.addEventListener("DOMContentLoaded", () => {
    loadProfile();
    initProfileForm();
    initCancelButton();
});

function loadProfile() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    document.getElementById("fullName").value = user.fullName || "";
    document.getElementById("phone").value = user.phone || "";
    document.getElementById("address").value = user.address || "";

    const emailInput = document.querySelector('input[type="email"]');
    if (emailInput) {
        emailInput.value = user.email || "";
    }
}

// function initProfileForm() {
//     const form = document.querySelector("form");
//     if (!form) return;

//     form.addEventListener("submit", (e) => {
//         e.preventDefault();

//         const fullName = document.getElementById("fullName").value.trim();
//         const phone = document.getElementById("phone").value.trim();
//         const address = document.getElementById("address").value.trim();
//         const password = document.getElementById("password").value.trim();

//         const user = JSON.parse(localStorage.getItem("user")) || {};

//         const updatedUser = {
//             ...user,
//             fullName,
//             phone,
//             address
//         };
//         if (password !== "") {
//             updatedUser.password = password;
//         }

//         localStorage.setItem("user", JSON.stringify(updatedUser));

//         alert("Cập nhật thông tin thành công");

//         // Không giữ password trên UI
//         document.getElementById("password").value = "";
//     });
// }

function initCancelButton() {
    const cancelBtn = document.getElementById("cancelProfileBtn");
    if (!cancelBtn) return;
    cancelBtn.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
}


