document.addEventListener("DOMContentLoaded", async () => {
    await loadProvinces();
    await loadProfile();
    initProfileForm();
    initCancelButton();
    initProvinceChange();
});

// Lưu trữ data provinces & wards để lookup
let provincesData = {};
let wardsData = {};

async function loadProfile() {
    const accessToken = localStorage.getItem("accessToken");
    
    if (!accessToken) {
        alert("Vui lòng đăng nhập");
        window.location.href = "./login.html";
        return;
    }

    try {
        const response = await fetch("http://localhost:8080/api/user/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (response.ok) {
            const userData = result.data;
            
            document.getElementById("fullName").value = userData.fullName || "";
            document.getElementById("phone").value = userData.phone || "";
            document.getElementById("detailAddress").value = userData.detailAddress || "";
            
            // Hiển thị email (disabled field)
            const emailInput = document.querySelector('input[type="email"]');
            if (emailInput) {
                emailInput.value = userData.userName || "";
            }

            // Set province code từ province name
            if (userData.provinceName) {
                const provinceCode = provincesData[userData.provinceName];
                
                if (provinceCode) {
                    document.getElementById("province").value = provinceCode;
                    await loadWards(provinceCode);
                    
                    // Set ward code từ ward name
                    if (userData.wardName) {
                        const wardCode = wardsData[userData.wardName];
                        if (wardCode) {
                            document.getElementById("ward").value = wardCode;
                        }
                    }
                }
            }
        } else {
            alert(result.message || "Không thể tải thông tin cá nhân");
        }
    } catch (error) {
        console.error(error);
        alert("Lỗi khi tải thông tin cá nhân");
    }
}

async function loadProvinces() {
    const accessToken = localStorage.getItem("accessToken");
    try {
        const response = await fetch("http://localhost:8080/api/user/provinces", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (response.ok) {
            const provinces = result.data.provinces || [];
            const provinceSelect = document.getElementById("province");
            provinceSelect.innerHTML = '<option value="">-- Chọn tỉnh/thành phố --</option>';

            // Lưu trữ dữ liệu provinces để lookup
            provinces.forEach(province => {
                provincesData[province.name] = province.code;
                const option = document.createElement("option");
                option.value = province.code;
                option.textContent = province.name;
                option.dataset.code = province.code;
                provinceSelect.appendChild(option);
            });
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error("Lỗi khi tải danh sách tỉnh:", error);
    }
}

async function loadWards(provinceCode) {
    const accessToken = localStorage.getItem("accessToken");
    try {
        const response = await fetch(`http://localhost:8080/api/user/wards?provinceCode=${encodeURIComponent(provinceCode)}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${accessToken}`,
                "Content-Type": "application/json"
            }
        });

        const result = await response.json();

        if (response.ok) {
            const wards = result.data.wards || [];
            const wardSelect = document.getElementById("ward");
            wardSelect.innerHTML = '<option value="">-- Chọn phường/xã --</option>';

            // Lưu trữ dữ liệu wards để lookup
            wardsData = {};
            wards.forEach(ward => {
                wardsData[ward.name] = ward.code;
                const option = document.createElement("option");
                option.value = ward.code;
                option.textContent = ward.name;
                option.dataset.code = ward.code;
                wardSelect.appendChild(option);
            });
        } else {
            console.error(result.message);
        }
    } catch (error) {
        console.error("Lỗi khi tải danh sách phường/xã:", error);
    }
}

function initProvinceChange() {
    const provinceSelect = document.getElementById("province");
    if (!provinceSelect) return;

    provinceSelect.addEventListener("change", (e) => {
        const provinceCode = e.target.value;
        const wardSelect = document.getElementById("ward");
        wardSelect.value = "";

        if (provinceCode) {
            loadWards(provinceCode);
        }
    });
}

function initCancelButton() {
    const cancelBtn = document.getElementById("cancelProfileBtn");
    if (!cancelBtn) return;
    cancelBtn.addEventListener("click", () => {
        window.location.href = "../../index.html";
    });
}

function initProfileForm() {
    const form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const accessToken = localStorage.getItem("accessToken");
        const submitBtn = form.querySelector('button[type="submit"]');
        
        const fullName = document.getElementById("fullName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const provinceSelect = document.getElementById("province");
        const wardSelect = document.getElementById("ward");
        const province = provinceSelect.value.trim();
        const ward = wardSelect.value.trim();
        const detailAddress = document.getElementById("detailAddress").value.trim();
        const password = document.getElementById("password").value.trim();
        if (!fullName) {
            alert("Vui lòng nhập họ và tên");
            return;
        }

        if (!phone) {
            alert("Vui lòng nhập số điện thoại");
            return;
        }

        // Validate phone format (10-11 digits)
        if (!/^\d{10,11}$/.test(phone)) {
            alert("Số điện thoại không hợp lệ (10-11 chữ số)");
            return;
        }

        if (!province) {
            alert("Vui lòng chọn tỉnh/thành phố");
            return;
        }

        if (!ward) {
            alert("Vui lòng chọn phường/xã");
            return;
        }

        if (!detailAddress) {
            alert("Vui lòng nhập địa chỉ chi tiết");
            return;
        }

        try {
            // Disable button khi đang submit
            submitBtn.disabled = true;

            const response = await fetch("http://localhost:8080/api/user/profile", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName,
                    phone,
                    provinceCode: province,
                    wardCode: ward,
                    detailAddress,
                    ...(password && { password })
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert(result.message || "Cập nhật thông tin thành công");
                document.getElementById("password").value = "";
                window.location.reload();
            } else {
                alert(result.message || "Cập nhật thất bại");
                submitBtn.disabled = false;
                submitBtn.innerHTML = "Cập nhật thông tin";
            }
        } catch (error) {
            console.error(error);
            alert("Lỗi khi cập nhật thông tin");
            submitBtn.disabled = false;
            submitBtn.innerHTML = "Cập nhật thông tin";
        }
    });
}

