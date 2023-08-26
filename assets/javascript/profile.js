{
    const profilePicInput = document.getElementById('profile-pic-input');
    const previewImg = document.getElementById('previewImage');

    //preview image while changing profile picture
    profilePicInput.addEventListener('change', evt => {
        const [file] = profilePicInput.files;
        if (file) {
            previewImg.src = URL.createObjectURL(file);
        }
    });

}
