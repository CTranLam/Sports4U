const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const products = {
    1: {
        id: 1,
        name: "ACEPRO ELITE PADDLE",
        price: 249,
        image: "../../assets/products/paddle-1.jpg",
        desc: "Gậy pickleball cao cấp"
    },
    2: {
        id: 2,
        name: "VELOCITY CARBON",
        price: 249,
        image: "../../assets/products/paddle-2.jpg",
        desc: "Carbon nhẹ, kiểm soát tốt"
    },
    3: {
        id: 3,
        name: "TITAN PRO",
        price: 249,
        image: "../../assets/products/paddle-3.jpg",
        desc: "Carbon nhẹ, kiểm soát tốt"
    },
    4: {
        id: 4,
        name: "RAPTOR SERIES",
        price: 249,
        image: "../../assets/products/paddle-4.jpg",
        desc: "Carbon nhẹ, kiểm soát tốt"
    }
};

const product = products[productId];

if (!product) {
    alert("Sản phẩm không tồn tại");
    window.location.href = "../index.html";
}

document.getElementById("productName").innerText = product.name;
document.getElementById("productPrice").innerText = product.price;
document.getElementById("productImage").src = product.image;
document.getElementById("productDesc").innerText = product.desc;

const quantityInput = document.getElementById("quantityInput");
const increaseBtn = document.getElementById("increaseBtn");
const decreaseBtn = document.getElementById("decreaseBtn");
const addToCartBtn = document.getElementById("addToCartBtn");
const buyNowBtn = document.getElementById("buyNowBtn");

const MAX_QTY = 10;

increaseBtn.addEventListener("click", () => {
    let qty = Number(quantityInput.value);
    if (qty < MAX_QTY) quantityInput.value = qty + 1;
});

decreaseBtn.addEventListener("click", () => {
    let qty = Number(quantityInput.value);
    if (qty > 1) quantityInput.value = qty - 1;
});

quantityInput.addEventListener("change", () => {
    let qty = Number(quantityInput.value);
    if (isNaN(qty) || qty < 1) quantityInput.value = 1;
    if (qty > MAX_QTY) quantityInput.value = MAX_QTY;
});

addToCartBtn.addEventListener("click", () => {
    const quantity = Number(quantityInput.value);

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existingItem = cart.find(item => item.productId === product.id);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity
        });
    }

    localStorage.setItem("cart", JSON.stringify(cart));

    alert("Đã thêm sản phẩm vào giỏ hàng");
});

buyNowBtn.addEventListener("click", () => {
    const quantity = Number(quantityInput.value);

    const buyNowData = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity
    };

    sessionStorage.setItem("buyNow", JSON.stringify(buyNowData));

    window.location.href = "../../pages/delivery.html";
});
