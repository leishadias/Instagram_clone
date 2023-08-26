const profilePicInput = document.getElementById('upload-pic-input');
const previewImg = document.getElementById('previewPost');

//preview image to be uploaded
profilePicInput.addEventListener('change', evt => {
    const [file] = profilePicInput.files;
    if (file) {
        previewImg.src = URL.createObjectURL(file);
    }
});