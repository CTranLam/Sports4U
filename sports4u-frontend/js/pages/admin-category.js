import { initPagination } from '../utils/pagination.js';

document.addEventListener("DOMContentLoaded", function () {
    const addCategoryBtn = document.getElementById("addCategoryBtn");
    const addCategoryModal = new bootstrap.Modal(document.getElementById("addCategoryModal"));
    const saveCategoryBtn = document.getElementById("saveCategoryBtn");
    const addCategoryForm = document.getElementById("addCategoryForm");
    addCategoryBtn.addEventListener("click", () => {
        addCategoryForm.reset();
        addCategoryModal.show();
    });

    saveCategoryBtn.addEventListener("click", () => {
        const categoryName = document.getElementById("categoryName").value;
        if (categoryName.trim()) {
            console.log("Thêm danh mục:", categoryName);
            addCategoryModal.hide();
        }
    });

    initPagination('paginationContainer', 'tbody tr', 10);
});
