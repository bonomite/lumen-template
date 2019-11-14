$(document).ready(function(){
    // open social share window in the center of the browser window, instead of default top-left
    $('.social-share').click( e => {
        e.preventDefault();
        let width = 600,
            height = 600,
            offset_left = window.screenX + (window.innerWidth / 2) - (width / 2),
            offset_top = window.screenY + (window.innerHeight / 2) - (height / 2);
        window.open($(e.currentTarget).attr('href'), 'newwindow', `width=${width}, height=${height}, left=${offset_left}, top=${offset_top}`);
    });
});
