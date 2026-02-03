import { initPagination } from '../utils/pagination.js';

const categoryProducts = {
    pickleball: {
        name: 'Pickleball',
        products: [
            { id: 1, name: 'ACEPRO ELITE PADDLE', image: '../../assets/products/paddle-1.jpg', price: '$249', stock: 20 },
            { id: 2, name: 'VELOCITY CARBON', image: '../../assets/products/paddle-2.jpg', price: '$199', stock: 5 },
            { id: 3, name: 'TITANIUM FLEX', image: '../../assets/products/paddle-3.jpg', price: '$299', stock: 0 }
        ]
    },
    badminton: {
        name: 'Badminton',
        products: [
            { id: 4, name: 'BADMINTON RACKET PRO', image: '../../assets/products/paddle-1.jpg', price: '$89', stock: 25 },
            { id: 5, name: 'SHUTTLE SET', image: '../../assets/products/paddle-2.jpg', price: '$45', stock: 40 }
        ]
    },
    basketball: {
        name: 'Basketball',
        products: [
            { id: 6, name: 'BASKETBALL PRO', image: '../../assets/products/paddle-1.jpg', price: '$129', stock: 18 },
            { id: 7, name: 'BASKETBALL SHOES', image: '../../assets/products/paddle-3.jpg', price: '$159', stock: 12 }
        ]
    },
    tennis: {
        name: 'Tennis',
        products: [
            { id: 8, name: 'TENNIS RACKET', image: '../../assets/products/paddle-1.jpg', price: '$199', stock: 22 },
            { id: 9, name: 'TENNIS BALL SET', image: '../../assets/products/paddle-2.jpg', price: '$25', stock: 50 }
        ]
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');

    if (category && categoryProducts[category]) {
        const categoryData = categoryProducts[category];
        document.getElementById('categoryTitle').textContent = categoryData.name;

        const tbody = document.getElementById('productsTable');
        tbody.innerHTML = categoryData.products.map((product, idx) => `
            <tr>
                <td>${idx + 1}</td>
                <td>
                    <div class="d-flex align-items-center gap-3">
                        <img src="${product.image}" class="rounded border" width="60"
                            height="60" style="object-fit: cover;">
                        <div>
                            <div class="fw-semibold">${product.name}</div>
                            <small class="text-muted">${categoryData.name}</small>
                        </div>
                    </div>
                </td>
                <td>${product.price}</td>
                <td>${product.stock}</td>
                <td class="text-end">
                    <a href="product-form.html?id=${product.id}" class="btn btn-sm btn-outline-primary">
                        <i class="bi bi-pencil"></i>
                    </a>
                    <button class="btn btn-sm btn-outline-danger">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    // Khởi tạo phân trang
    initPagination('paginationContainer', 'tbody tr', 5);
});
