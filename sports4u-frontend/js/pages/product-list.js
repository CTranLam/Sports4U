import { initPagination } from '../utils/pagination.js';

document.addEventListener("DOMContentLoaded", () => {
    initPagination('paginationContainer', '.col-lg-3.col-md-4.col-sm-6', 12);
});
