$(document).ready(function() {
    var currentURL = window.location.pathname; // Get the current URL path

    //highlight the item thats clicked on the nav bar
    $('#nav-items>li').each(function() {
        var link = $(this).find('a').attr('href'); // Get the link URL for each navigation item
        if (link === currentURL) {
            $(this).addClass('temporary-highlight'); // Add class if URL matches
        }
    });
});