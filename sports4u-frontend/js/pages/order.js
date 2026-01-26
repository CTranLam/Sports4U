document.addEventListener("DOMContentLoaded", () => {
    initOrderTabs();
    initOrderClick();
});

function initOrderTabs() {
    const tabs = document.querySelectorAll("#orderTabs .nav-link");
    const orders = document.querySelectorAll(".order-item");

    if (!tabs.length || !orders.length) return;

    // tab mặc định = ALL
    setActiveTab(tabs[0], orders);

    tabs.forEach(tab => {
        tab.addEventListener("click", () => {
            setActiveTab(tab, orders);
        });
    });
}

function setActiveTab(activeTab, orders) {
    const tabs = document.querySelectorAll("#orderTabs .nav-link");
    tabs.forEach(t => t.classList.remove("active"));
    activeTab.classList.add("active");

    const status = activeTab.dataset.status;
    orders.forEach(order => {
        const orderStatus = order.dataset.status;
        order.style.display =
            status === "ALL" || orderStatus === status
                ? "block"
                : "none";
    });
}

function initOrderClick() {
    const orders = document.querySelectorAll(".order-item");

    orders.forEach(order => {
        order.addEventListener("click", () => {
            const orderCode = order.querySelector(".fw-semibold")?.innerText;
            console.log("Click order:", orderCode);

            // redirect sang trang chi tiết
        });
    });
}
