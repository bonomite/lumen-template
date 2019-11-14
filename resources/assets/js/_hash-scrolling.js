$(document).ready(function(){
    // if page is loaded for a specific section/element, prevent jump and scroll cleanly
    if(window.location.hash) {
        window.scrollTo(0, 0);
        setTimeout(function(){
            let $target = $(`${window.location.hash}`);
            scrollToHash($target);

            /*or use gsap solution*/
            //alwaysScrollTo(1,$target,10,hashScrollComplete);

        }, 100);
    }

    function scrollToHash($target) {
        let offset = $('header').outerHeight() + 15;
        let speed = 2000;

        if($target.is($('.main > section:first-of-type'))){
            offset = 200;
            speed = 1000;
        }

        $('html, body').animate({
            scrollTop: $target.offset().top - offset
        }, speed, function() {
            // Animation complete.
            hashScrollComplete();
        });
    }

    function hashScrollComplete(){
        //console.log('hash scroll complete');
    }

    // prevent empty href action
    $(document).on('click', 'a[href="#"]', e => e.preventDefault());

    // @todo: bind event listeners to call scrollToHash() when in-page hash links are clicked
});
