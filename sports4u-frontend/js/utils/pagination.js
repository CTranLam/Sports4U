export function initPagination(containerId, rowSelector, itemsPerPage = 4) {
    let currentPage = 0;
    const totalPages = 3; 

    function showPage(page) {
        const rows = document.querySelectorAll(rowSelector);
        const startIndex = page * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        rows.forEach((row, index) => {
            if (index >= startIndex && index < endIndex) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    function renderPagination() {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = "";

        // Nút Previous
        const prev = document.createElement("button");
        prev.className = "btn btn-sm btn-outline-secondary";
        prev.textContent = "‹";
        prev.disabled = currentPage === 0;
        prev.onclick = () => {
            if (currentPage > 0) {
                currentPage--;
                showPage(currentPage);
                renderPagination();
            }
        };
        container.appendChild(prev);

        // Các nút trang
        for (let i = 0; i < totalPages; i++) {
            const btn = document.createElement("button");
            btn.className = `btn btn-sm ${i === currentPage ? "btn-primary" : "btn-outline-primary"}`;
            btn.textContent = i + 1;
            btn.onclick = () => {
                currentPage = i;
                showPage(currentPage);
                renderPagination();
            };
            container.appendChild(btn);
        }

        // Nút Next
        const next = document.createElement("button");
        next.className = "btn btn-sm btn-outline-secondary";
        next.textContent = "›";
        next.disabled = currentPage === totalPages - 1;
        next.onclick = () => {
            if (currentPage < totalPages - 1) {
                currentPage++;
                showPage(currentPage);
                renderPagination();
            }
        };
        container.appendChild(next);
    }

    // Khởi tạo
    renderPagination();
    showPage(0);
}
