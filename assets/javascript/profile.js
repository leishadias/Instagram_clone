{
    // const profilePicInput = $('#profile-pic-input');
    // const previewImg = $('#previewImage');

    const profilePicInput = document.getElementById('profile-pic-input');
    const previewImg = document.getElementById('previewImage');

    profilePicInput.addEventListener('change', evt => {
        const [file] = profilePicInput.files;
        if (file) {
            previewImg.src = URL.createObjectURL(file);
        }
    });
}