const API_BASE = "http://localhost:8080/api/admin";
const token = localStorage.getItem("accessToken");

document.addEventListener("DOMContentLoaded", async () => {
    if (!token) {
        window.location.href = "../../pages/login.html";
        return;
    }

    const currentYear = new Date().getFullYear();
    document.getElementById("yearSelect").value = currentYear;

    await Promise.all([
        loadSummary(),
        loadRevenueChart(currentYear),
        loadCategoryChart(),
        loadOrdersLast7Days(),
    ]);

    document.getElementById("yearSelect").addEventListener("change", async function () {
        await loadRevenueChart(parseInt(this.value));
    });
});

async function apiFetch(path) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message || "Lỗi API");
    return json.data;
}

async function loadSummary() {
    try {
        const data = await apiFetch("/dashboard/summary");
        document.getElementById("statUsers").textContent    = data.totalUsers    ?? 0;
        document.getElementById("statProducts").textContent = data.totalProducts ?? 0;
        document.getElementById("statOrders").textContent   = data.totalOrders   ?? 0;
    } catch (e) {
        console.error("loadSummary:", e);
    }
}

let revenueChart = null;
async function loadRevenueChart(year) {
    try {
        const data = await apiFetch(`/dashboard/revenue-by-month?year=${year}`);

        const list     = data.revenues ?? [];
        const labels   = Array.from({ length: 12 }, (_, i) => `T${i + 1}`);
        const revenues = Array.from({ length: 12 }, (_, i) => {
            const found = list.find(d => d.month === i + 1);
            return found ? found.revenue : 0;
        });

        if (revenueChart) revenueChart.destroy();

        revenueChart = new Chart(document.getElementById("revenueChart"), {
            type: "bar",
            data: {
                labels,
                datasets: [{
                    label: "Doanh thu (₫)",
                    data: revenues,
                    backgroundColor: "rgba(13,110,253,0.75)",
                    borderRadius: 6,
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        ticks: {
                            callback: v => new Intl.NumberFormat("vi-VN", { notation: "compact" }).format(v)
                        }
                    }
                }
            }
        });
    } catch (e) {
        console.error("loadRevenueChart:", e);
    }
}

async function loadCategoryChart() {
    try {
        const data = await apiFetch("/dashboard/product-by-category");

        const list   = data.stats ?? [];
        const labels = list.map(d => d.category);
        const counts = list.map(d => d.count);
        const colors = ["#0d6efd", "#198754", "#ffc107", "#dc3545", "#0dcaf0", "#6f42c1"];

        new Chart(document.getElementById("categoryChart"), {
            type: "doughnut",
            data: {
                labels,
                datasets: [{
                    data: counts,
                    backgroundColor: colors.slice(0, labels.length),
                    borderWidth: 2,
                }]
            },
            options: {
                plugins: {
                    legend: { position: "bottom", labels: { boxWidth: 12 } }
                }
            }
        });
    } catch (e) {
        console.error("loadCategoryChart:", e);
    }
}


async function loadOrdersLast7Days() {
    try {
        const data = await apiFetch("/dashboard/orders-last-7-days");

        const list   = data.orders ?? [];
        const labels = list.map(d => {
            const date = new Date(d.date);
            return `${date.getDate()}/${date.getMonth() + 1}`;
        });
        const counts = list.map(d => d.count);

        new Chart(document.getElementById("orderChart"), {
            type: "line",
            data: {
                labels,
                datasets: [{
                    label: "Đơn hàng",
                    data: counts,
                    borderColor: "#198754",
                    backgroundColor: "rgba(25,135,84,0.1)",
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: "#198754",
                    pointRadius: 5,
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, ticks: { stepSize: 1 } }
                }
            }
        });
    } catch (e) {
        console.error("loadOrdersLast7Days:", e);
    }
}