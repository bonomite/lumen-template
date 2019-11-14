
$(document).ready(() => {
    /* collapsible references */

    let $references = $('#references');
    let $buttonText = $('.buttonReference span');
    let $chevron = $('.buttonReference i');

    $references.on('show.bs.collapse', function () {
        $buttonText.text( "Hide References" ).fadeIn();
        $chevron.addClass('rotateChevron');
    });

    $references.on('hide.bs.collapse', function () {
        $buttonText.text( "Show References" ).fadeIn();
        $chevron.removeClass('rotateChevron');
    });
});
