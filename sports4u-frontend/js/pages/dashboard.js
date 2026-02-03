document.addEventListener("DOMContentLoaded", function () {
    initCharts();
});

function initCharts() {
    new Chart(document.getElementById('revenueChart'), {
        type: 'line',
        data: {
            labels: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
            datasets: [{
                label: 'Doanh thu (triệu VNĐ)',
                data: [120, 150, 180, 170, 210, 250],
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        }
    });

    new Chart(document.getElementById('categoryChart'), {
        type: 'doughnut',
        data: {
            labels: ['Pickleball', 'Football', 'Basketball'],
            datasets: [{
                data: [35, 30, 21]
            }]
        }
    });

    new Chart(document.getElementById('orderChart'), {
        type: 'bar',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Đơn hàng',
                data: [5, 8, 6, 10, 7, 4, 2]
            }]
        }
    });
}