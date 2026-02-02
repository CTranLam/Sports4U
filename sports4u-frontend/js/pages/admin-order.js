import { initPagination } from '../utils/pagination.js';

document.addEventListener("DOMContentLoaded", () => {
    initFilterStatus();
    initPagination('paginationContainer', 'tbody tr', 4);
});

function initFilterStatus() {
    const statusFilter = document.getElementById("statusFilter");
    
    if (!statusFilter) return;

    statusFilter.addEventListener("change", (e) => {
        const selectedStatus = e.target.value;
        filterOrders();
        console.log("Lọc theo trạng thái:", selectedStatus);
    });
}

function filterOrders() {
    const statusFilter = document.getElementById("statusFilter").value;
    const tableRows = document.querySelectorAll("tbody tr");

    tableRows.forEach(row => {
        let isVisible = true;

        // Kiểm tra trạng thái
        if (statusFilter) {
            const statusButton = row.querySelector("td:nth-child(4) .dropdown-toggle");
            if (statusButton && statusButton.textContent.trim() !== statusFilter) {
                isVisible = false;
            }
        }

        row.style.display = isVisible ? "" : "none";
    });
}
