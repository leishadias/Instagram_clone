const profilePicInput = document.getElementById('upload-pic-input');
const previewImg = document.getElementById('previewPost');

profilePicInput.addEventListener('change', evt => {
    const [file] = profilePicInput.files;
    if (file) {
        previewImg.src = URL.createObjectURL(file);
    }
});