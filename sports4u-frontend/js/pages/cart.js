document.addEventListener("DOMContentLoaded", () => {
    const state = initState();
    bindEvents(state);
});


function initState() {
    return {
        checkAll: document.getElementById("checkAll"),
        itemChecks: document.querySelectorAll(".item-check"),
        totalPriceEl: document.getElementById("totalPrice"),
        orderBtn: document.querySelector(".btn.btn-dark.w-100"),
        removeButtons: document.querySelectorAll(".btn-remove"),

        PRICE_MAP: {
            p001: 249,
            p002: 249
        }
    };
}

function bindEvents(state) {
    bindCheckAll(state);
    bindSingleCheck(state);
    bindPlaceOrder(state);
}

// check và uncheck tất cả
function bindCheckAll({ checkAll, itemChecks }) {
    checkAll.addEventListener("change", () => {
        itemChecks.forEach(cb => cb.checked = checkAll.checked);
        updateTotal();
    });
}

function bindSingleCheck({ checkAll, itemChecks }) {
    // callback khi check/uncheck từng item
    itemChecks.forEach(cb => {
        cb.addEventListener("change", () => {
            checkAll.checked = [...itemChecks].every(i => i.checked);
            updateTotal();
        });
    });
}


function bindPlaceOrder({ orderBtn, itemChecks, PRICE_MAP }) {
    orderBtn.addEventListener("click", () => {
        const selectedItems = [...itemChecks].filter(cb => cb.checked);

        if (selectedItems.length === 0) {
            alert("Vui lòng chọn ít nhất 1 sản phẩm để đặt hàng!");
            return;
        }

        const orderData = selectedItems.map(cb => ({
            productId: cb.dataset.id,
            price: PRICE_MAP[cb.dataset.id]
        }));

        localStorage.setItem("checkout_items", JSON.stringify(orderData));
        window.location.href = "../../pages/delivery.html";
    });
}

function updateTotal() {
    const PRICE_MAP = {
        p001: 249,
        p002: 249
    };

    let total = 0;
    document.querySelectorAll(".item-check:checked").forEach(cb => {
        total += PRICE_MAP[cb.dataset.id] || 0;
    });

    document.getElementById("totalPrice").textContent =
        `USD ${total.toFixed(2)}`;
}
