const previewProductImage = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const preview = document.getElementById('previewImage');
    preview.src = URL.createObjectURL(file);
};
