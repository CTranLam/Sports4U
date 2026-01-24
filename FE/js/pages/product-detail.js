const params = new URLSearchParams(window.location.search);
const productId = params.get('id');

/*
  MOCK DATA
*/
const products = {
    1: {
        name: "ACEPRO ELITE PADDLE",
        price: 249,
        image: "../../assets/products/paddle-1.jpg",
        desc: "Gậy pickleball cao cấp"
    },
    2: {
        name: "VELOCITY CARBON",
        price: 249,
        image: "../../assets/products/paddle-2.jpg",
        desc: "Carbon nhẹ, kiểm soát tốt"
    },
    3: {
        name: "TITAN PRO",
        price: 249,
        image: "../../assets/products/paddle-3.jpg",
        desc: "Carbon nhẹ, kiểm soát tốt"
    },
    4: {
        name: "RAPTOR SERIES",
        price: 249,
        image: "../../assets/products/paddle-4.jpg",
        desc: "Carbon nhẹ, kiểm soát tốt"
    }

};

const product = products[productId];

if (product) {
    document.getElementById("productName").innerText = product.name;
    document.getElementById("productPrice").innerText = `${product.price}`;
    document.getElementById("productImage").src = product.image;
    document.getElementById("productDesc").innerText = product.desc;
}

// Quantity Control
const quantityInput = document.getElementById("quantityInput");
const increaseBtn = document.getElementById("increaseBtn");
const decreaseBtn = document.getElementById("decreaseBtn");
const addToCartBtn = document.getElementById("addToCartBtn");
const buyNowBtn = document.getElementById("buyNowBtn");

increaseBtn.addEventListener("click", () => {
    let quantity = parseInt(quantityInput.value);
    if (quantity < 10) {
        quantityInput.value = quantity + 1;
    }
});

decreaseBtn.addEventListener("click", () => {
    let quantity = parseInt(quantityInput.value);
    if (quantity > 1) {
        quantityInput.value = quantity - 1;
    }
});

quantityInput.addEventListener("change", () => {
    let quantity = parseInt(quantityInput.value);
    if (isNaN(quantity) || quantity < 1) {
        quantityInput.value = 1;
    } else if (quantity > 10) {
        quantityInput.value = 10;
    }
});

addToCartBtn.addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    console.log(`Thêm ${quantity} sản phẩm vào giỏ hàng`);
    // Add to cart logic here
});

buyNowBtn.addEventListener("click", () => {
    const quantity = parseInt(quantityInput.value);
    console.log(`Mua ${quantity} sản phẩm ngay`);
    // Buy now logic here
});

