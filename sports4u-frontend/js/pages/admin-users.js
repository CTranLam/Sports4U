import { initPagination } from '../utils/pagination.js';

document.addEventListener("DOMContentLoaded", () => {
    initEditUserModal();
    initAddUserModal();
    initFilterStatus();
    initFilterRole();
    initPagination('paginationContainer', 'tbody tr', 4);
});

function initEditUserModal() {
    const editButtons = document.querySelectorAll(".btn-edit");
    const editEmail = document.getElementById("editEmail");
    const editRole = document.getElementById("editRole");
    const modalElement = document.getElementById("editUserModal");

    if (!modalElement) return;

    const editModal = new bootstrap.Modal(modalElement);

    editButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            editEmail.value = btn.dataset.email;
            editRole.value = btn.dataset.role;

            editModal.show();
        });
    });
}

function initAddUserModal() {
    const addBtn = document.getElementById("addAccountBtn");
    const modalElement = document.getElementById("addUserModal");
    const form = modalElement?.querySelector("form");

    if (!modalElement || !form) return;

    const addModal = new bootstrap.Modal(modalElement);
    
    // Bắt sự kiện click button Thêm tài khoản
    if (addBtn) {
        addBtn.addEventListener("click", () => {
            addModal.show();
        });
    }
    modalElement.addEventListener("show.bs.modal", () => {
        form.reset();
    });
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        const payload = {
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
            role: formData.get("role"),
            status: formData.get("status")
        };

        if (payload.password !== payload.confirmPassword) {
            alert("Mật khẩu nhập lại không khớp");
            return;
        }

        console.log("ADD USER PAYLOAD:", payload);

        addModal.hide();
    });
}

function initFilterStatus() {
    const statusFilter = document.getElementById("statusFilter");
    
    if (!statusFilter) return;

    statusFilter.addEventListener("change", (e) => {
        const selectedStatus = e.target.value;
        filterUsers();
        console.log("Lọc theo trạng thái:", selectedStatus);
    });
}

function initFilterRole() {
    const roleFilter = document.getElementById("roleFilter");
    
    if (!roleFilter) return;

    roleFilter.addEventListener("change", (e) => {
        const selectedRole = e.target.value;
        filterUsers();
        console.log("Lọc theo role:", selectedRole);
    });
}

function filterUsers() {
    const statusFilter = document.getElementById("statusFilter").value;
    const roleFilter = document.getElementById("roleFilter").value;
    const tableRows = document.querySelectorAll("tbody tr");

    tableRows.forEach(row => {
        let isVisible = true;

        // Kiểm tra trạng thái
        if (statusFilter) {
            const statusBadge = row.querySelector("td:nth-child(4) .badge");
            if (statusBadge && statusBadge.textContent.trim() !== statusFilter) {
                isVisible = false;
            }
        }

        // Kiểm tra role
        if (roleFilter) {
            const roleBadge = row.querySelector("td:nth-child(3) .badge");
            if (roleBadge && roleBadge.textContent.trim() !== roleFilter) {
                isVisible = false;
            }
        }

        row.style.display = isVisible ? "" : "none";
    });
}

