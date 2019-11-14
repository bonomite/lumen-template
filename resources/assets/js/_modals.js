$(document).ready(function() {
    // exit interstitial links
    /*$(document).on('click', 'a[data-target="#exitInterstitial"]', e => $('.follow-exit-link').attr('href', $(e.currentTarget).attr('href')));
    $('.follow-exit-link').click(() => $('#exitInterstitial').modal('hide'));*/

    let $allModalTriggers = $( "*[data-modal-id]" );
    let currentTrigger;
    $allModalTriggers.css('cursor','pointer');
    $allModalTriggers.on('click',function(e){
    	e.preventDefault();
    	currentTrigger = e.target;

        let url = $(this).attr('href') || $(this).attr('data-link') || $(this).find('.nav-link').attr('href');
                
        let $currentModal = $('#'+$(this).attr('data-modal-id'));
        $currentModal.find('.url').text(url);
        $currentModal.find('.follow-exit-link').attr('href',url).on('click',function(){$currentModal.modal('hide');});
        $currentModal.modal();
    });
    // return focus to the button that opened a model when it is closed
    $('.modal-header .close').on('click', (e) => {
        console.log(currentTrigger);
        if(currentTrigger) {
            window.setTimeout(() => {
                currentTrigger.focus();
            }, 50)
        }
    });
    /*hcp question initial modal & modal session storage solution*/

    /*detects if the first 5 characters are "/hcp/" to confirm we are in a HCP page*/
/*    if(window.location.pathname.substring(0,4) == '/hcp') { 
        setTimeout(() => {
            //if session storage is not set, continue      
            if (!sessionStorage.getItem("hcpModal")) {
                $('#hcpDirectModal').modal();

                $(document).on('click.hcpModal', '#hcpDirectModal .follow-exit-link', function() {
                    sessionStorage.setItem("hcpModal", true);                       
                    $(document).off('click.hcpModal');
                    $(document).off('keyup.hcpModal');
                });

                $(document).on('click.hcpModal', '#hcpDirectModal .return', function(e) {                       
                    goBackToPatient();                                              
                });
                                    
                $(document).on('keyup.hcpModal',function (e) {
                    if (e.which == 27 && $('body').hasClass('modal-open')) {
                        goBackToPatient();                                                      
                    }
                });

                $(document).on('click.hcpModal',function (e) {                      
                    if (e.target === $('#hcpDirectModal')[0] && $('body').hasClass('modal-open')) {
                        goBackToPatient();                                                      
                    }
                });

                function goBackToPatient(){
                    //where ever your target page is when not a HCP
                    window.location.replace("/");
                }

            }

        }, 500);
    }
*/

});
