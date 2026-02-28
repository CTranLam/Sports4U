let currentPage = 1;
let currentStatus = "";
let currentRole = "";

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
        window.location.href = "../../pages/login.html";
        return;
    }

    await loadUsers(token);

    // Filter
    document.getElementById("statusFilter").addEventListener("change", async function () {
        currentStatus = this.value;
        currentPage = 1;
        await loadUsers(token);
    });

    document.getElementById("roleFilter").addEventListener("change", async function () {
        currentRole = this.value;
        currentPage = 1;
        await loadUsers(token);
    });

    // Thêm tài khoản
    document.getElementById("addAccountBtn").addEventListener("click", () => {
        new bootstrap.Modal(document.getElementById("addUserModal")).show();
    });

    // Submit thêm tài khoản
    document.getElementById("addUserForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        await createAccount(token);
    });

    // Lưu chỉnh sửa
    document.getElementById("saveEditBtn").addEventListener("click", async () => {
        await updateAccount(token);
    });
});

async function loadUsers(token) {
    try {
        const statusParam = currentStatus ? `&status=${currentStatus}` : "";
        const roleParam = currentRole ? `&role=${currentRole}` : "";

        const response = await fetch(
            `http://localhost:8080/api/admin/accounts?page=${currentPage}&size=10${statusParam}${roleParam}`,
            { headers: { "Authorization": `Bearer ${token}` } }
        );

        const result = await response.json();
        if (!response.ok) {
            console.error(result.message);
            return;
        }

        renderUsers(result.data?.content || [], token);
        renderPagination(result.data, token);

    } catch (error) {
        console.error("Lỗi khi tải danh sách tài khoản:", error);
    }
}

function renderUsers(users) {  
    const tbody = document.getElementById("userTableBody");

    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted py-4">Không có tài khoản nào</td></tr>`;
        return;
    }

    tbody.innerHTML = users.map((user, index) => `
        <tr>
            <td>${index + 1 + (currentPage - 1) * 10}</td>
            <td>
                <div>${user.userName}</div>
                ${user.fullName ? `<small class="text-muted">${user.fullName}</small>` : ""}
            </td>
            <td>
                <span class="badge ${user.role === 'ROLE_ADMIN' ? 'bg-primary' : 'bg-secondary'}">
                    ${user.role === 'ROLE_ADMIN' ? 'Admin' : 'User'}
                </span>
            </td>
            <td>
                <span class="badge ${user.status === 1 ? 'bg-success' : 'bg-danger'}">
                    ${user.status === 1 ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td class="text-end">
                <button class="btn btn-sm btn-outline-primary me-1"
                    onclick="openEditModal(${user.userId}, '${user.userName}', '${user.role}')">
                    Sửa
                </button>
                ${user.status === 1
                    ? `<button class="btn btn-sm btn-outline-danger" onclick="lockAccount(${user.userId})">Khóa</button>`
                    : `<button class="btn btn-sm btn-outline-success" onclick="unlockAccount(${user.userId})">Mở khóa</button>`
                }
            </td>
        </tr>
    `).join("");
}

function openEditModal(userId, email, role) {
    document.getElementById("editUserId").value = userId;
    document.getElementById("editEmail").value = email;
    document.getElementById("editRole").value = role;
    new bootstrap.Modal(document.getElementById("editUserModal")).show();
}

async function updateAccount(token) {
    const userId = document.getElementById("editUserId").value;
    const role = document.getElementById("editRole").value;
    const newPassword = document.getElementById("editPassword").value;

    const body = { role };
    if (newPassword.trim()) {
        body.newPassword = newPassword;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/admin/account/${userId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(body)
        });

        const result = await response.json();
        if (result.success) {
            alert("Cập nhật tài khoản thành công");
            document.getElementById("editPassword").value = "";
            bootstrap.Modal.getInstance(document.getElementById("editUserModal")).hide();
            await loadUsers(token);
        } else {
            alert(result.message || "Cập nhật thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi cập nhật tài khoản:", error);
    }
}

async function createAccount(token) {
    const email = document.getElementById("newEmail").value;
    const password = document.getElementById("newPassword").value;
    const retypePassword = document.getElementById("newRetypePassword").value;
    const role = document.getElementById("newRole").value;
    const status = document.getElementById("newStatus").value;

    try {
        const response = await fetch("http://localhost:8080/api/admin/account", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ email, password, retypePassword, role, status })
        });

        const result = await response.json();
        if (result.success) {
            alert("Tạo tài khoản thành công");
            bootstrap.Modal.getInstance(document.getElementById("addUserModal")).hide();
            document.getElementById("addUserForm").reset();
            await loadUsers(token);
        } else {
            alert(result.message || "Tạo tài khoản thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi tạo tài khoản:", error);
    }
}

async function lockAccount(userId) {
    if (!confirm("Bạn có chắc muốn khóa tài khoản này không?")) return;
    const token = localStorage.getItem("accessToken"); 
    try {
        const response = await fetch(`http://localhost:8080/api/admin/account/${userId}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
            alert("Đã khóa tài khoản");
            await loadUsers(token);
        } else {
            alert(result.message || "Khóa tài khoản thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi khóa tài khoản:", error);
    }
}

async function unlockAccount(userId) {
    if (!confirm("Bạn có chắc muốn mở khóa tài khoản này không?")) return;
    const token = localStorage.getItem("accessToken"); 
    try {
        const response = await fetch(`http://localhost:8080/api/admin/account/${userId}/unlock`, {
            method: "PUT",
            headers: { "Authorization": `Bearer ${token}` }
        });
        const result = await response.json();
        if (result.success) {
            alert("Đã mở khóa tài khoản");
            await loadUsers(token);
        } else {
            alert(result.message || "Mở khóa thất bại");
        }
    } catch (error) {
        console.error("Lỗi khi mở khóa tài khoản:", error);
    }
}

function renderPagination(pageData, token) {
    const container = document.getElementById("paginationContainer");
    if (!container) return;
    container.innerHTML = "";

    const totalPages = pageData?.totalPages ?? 1;
    const current = currentPage;

    const prev = document.createElement("button");
    prev.className = "btn btn-sm btn-outline-secondary";
    prev.textContent = "‹";
    prev.disabled = current === 1;
    prev.onclick = async () => { currentPage = current - 1; await loadUsers(token); };
    container.appendChild(prev);

    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement("button");
        btn.className = `btn btn-sm ${i === current ? "btn-primary" : "btn-outline-primary"}`;
        btn.textContent = i;
        btn.onclick = async () => { currentPage = i; await loadUsers(token); };
        container.appendChild(btn);
    }

    const next = document.createElement("button");
    next.className = "btn btn-sm btn-outline-secondary";
    next.textContent = "›";
    next.disabled = current >= totalPages;
    next.onclick = async () => { currentPage = current + 1; await loadUsers(token); };
    container.appendChild(next);
}