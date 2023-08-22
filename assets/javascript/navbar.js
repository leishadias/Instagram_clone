$(document).ready(function() {
    var currentURL = window.location.pathname; // Get the current URL path

    $('#nav-items>li').each(function() {
        var link = $(this).find('a').attr('href'); // Get the link URL for each navigation item
        // console.log(currentURL);
        if (link === currentURL) {
            $(this).addClass('temporary-highlight'); // Add class if URL matches
        }
    });
});