let portrait,
    $body,
    $html,
    $main,
    $menu,
    $toggler,
    $header,
    $skipToContent,
    headerHeight,
    $footer,
    $isi,
    $isi_inline,
    isi_compress = false,
    isi_compress_buffer,
    $navbar,
    isDown = false, 
    isUp = false,
    mobileBreakPoint = 767;

/*globals*/
window.lt768;
window.lt1024;
window.isMobile = false
window.menuOpen = false
window.curr_width;
window.curr_height;
window.curr_innerHeight;

    
const $window = $(window),
      $document = $(document);

import MobileDetect from 'mobile-detect'; 
let md = new MobileDetect(window.navigator.userAgent);
if(md.mobile() != null){
    window.isMobile = true;        
}
// console.log('window.isMobile = '+window.isMobile);

let debounced = function(){
	resizeCheck();
};


$window.on('resize',resizeCheck.throttle(500,false));
$window.on('resize',debounced.debounce(500));

$window.on('orientationchange', function() {
    detectOrientation(window.orientation);        
});


function detectOrientation(orientation){
    if ( (orientation == 0 || orientation == 180) ){ // Landscape
        portrait = true;
        //console.log('portrait = true');
    } 
    else if( (orientation == -90 || orientation == 90) ){ // Portrait
        portrait  = false;
        //console.log('portrait = false');
    }
    else {

    }
    resizeCheck();
}

function resizeCheck() {
    //console.log('resized');
    window.curr_width = $window.width();
    window.curr_height = $window.height();
    window.curr_innerHeight = $window.innerHeight();

    if(window.curr_width < 768){
        window.lt768 = true;
    }else{
        window.lt768 = false;
    }

    if(window.curr_width < 1024){
        window.lt1024 = true;

    }else{
        window.lt1024 = false;
    }

    if(window.menuOpen){                
        $toggler.first().click();
    }
}



$(document).ready(function() {

    $header = $('body > header');
    $skipToContent = $('#skipToContent');
    headerHeight = $header.height();
    $footer = $('footer');
    $body = $('body');    
    $main = $('#main');    
    $navbar = $header.find('.navbar');
    $html = $('html');
    $menu = $navbar.find('#navbarSupportedContent');
    $toggler = $navbar.find('.navbar-toggler');
    $isi = $('#isi');
    $isi_inline = $('#isi_inline');

    /*forces ios to refresh and not use page caching when using the browser back and forward buttons */
    $window.bind("pageshow", function(event) {
        if (event.originalEvent.persisted) {
            window.location.reload();
        }
    });

    resizeCheck();

    initMenu();
    
    initISI();

    initHideHeader(headerHeight);

    initFormFocusSystem();


    /*optional*/
    webpSupport();

    init();

});


function initMenu(){

	/*menu selection*/
	let $activeLink = $('a[href="'+location.pathname+'"]');
    $activeLink.closest('.nav-item').addClass('active');
    if(!$activeLink.closest('.dropdown').hasClass('active')){
    	//add active child indicator
    	$activeLink.closest('.dropdown').addClass('active-child');
    }	

    /*dropdown updates*/
    /*fixes the multi active situation with dropdowns and its items*/
    let $dropdowns = $navbar.find('.dropdown');
    if($dropdowns.find('.active').length > 0){$dropdowns.removeClass('active');}

    /*dropdown alt click code (if dropdown is open and click again, go to href)*/
    let $dropdownsToggle = $dropdowns.find('.dropdown-toggle');    
    $dropdownsToggle.on('click',function(e){
    	//console.log('clicking');
    	e.preventDefault();
    	e.stopPropagation();	    	
    	let $th = $(this);
    	if(window.curr_width <= mobileBreakPoint){
    		if($th.closest('.dropdown').hasClass('show')){	    		
	    		window.location = $th.attr('href');
	    	}
    	}else{
            if(!window.isMobile){
                if($th.find('.dropdown-menu:visible')  ){
                    window.location = $th.attr('href');
                }
            }else{
                /*google pixel/android tablet fix*/
                if($th.parent().hasClass('show')){
                    window.location = $th.attr('href');
                }
            }
        }
    });

    /*rollover dropdowns*/
    function toggleDropdown (e) {
		let _d = $(e.target).closest('.dropdown'),
			_m = $('.dropdown-menu', _d);
		//console.log('toggling = '+e.type);
		setTimeout(function(){
			/*accessibility tab support*/
			let shouldOpen = e.type !== 'click' && e.type !== 'focusout' && _d.is(':hover') || e.type == 'focusin';
			_m.toggleClass('show', shouldOpen);
			_d.toggleClass('show', shouldOpen);
			$('[data-toggle="dropdown"]', _d).attr('aria-expanded', shouldOpen);
		}, e.type === 'mouseleave' ? 300 : 0);
	}

	$body
	  .on('mouseenter mouseleave focus blur','nav .dropdown',toggleDropdown)
	  .on('click', 'nav .dropdown a', toggleDropdown);

	/*accessibility skip menu support*/  
    $skipToContent.on('focus blur',function(e){        
        //console.log('e.type = '+e.type);
        let $th = $(this);
        let hash = $th.attr('href');        
        if(e.type == 'focus'){
            $body.on('keydown.hash',function(e){
                console.log('key = '+e.keyCode);
                if(e.keyCode === 13 || e.keyCode === 32){
                    e.preventDefault();
                    $(hash).find('input, select, button, a').first().focus();
                }
            });
			$th.addClass('active');
		}else{
            $body.off('keydown.hash');
			$th.removeClass('active');
		}
	});


    /*mobile menu button*/
    /*add collapsed class to init the button classes */
    $toggler.addClass('collapsed');
    /*makes header full opacity when clicked*/
    $toggler.on('click',function(e){	    	
    	e.preventDefault();
    	e.stopPropagation();
    	
    	if(!$header.hasClass('menuOpen')){
	    	openMenu();
    	}else{
	    	closeMenu();
    	}
    });

    function openMenu(){
    	window.menuOpen = true;
		$header.addClass('menuOpen');
		$toggler.removeClass('collapsed');
		$menu.css('display','block');		
		$header.css('z-index','1030');		
    	
    	/*gsap animation for displaying the mobile menu (use '-window.curr_width' to have it come from the left, also adjust the closeMenu instance)*/
    	TweenMax.set($menu,{x:window.curr_width});
    	TweenMax.to($menu,0.5,{x:0, ease:Sine.easeOut});

    	hamburgerAnim.play();

    	bodyScroll(false);
    }

    function closeMenu(){
    	window.menuOpen = false;
		$header.removeClass('menuOpen');
		$toggler.addClass('collapsed');
    	
    	TweenMax.to($menu,0.5,{x:window.curr_width, ease:Sine.easeIn, onComplete:function(){		    		
    		$menu.css('display','none');
    		$header.css('z-index','1000');		    		
			TweenMax.set($menu,{x:0});
    	}});

    	hamburgerAnim.reverse();

    	bodyScroll(true);
    }

    let hm = $toggler.find('#hamburger') ;
    let hamburgerAnim = new TimelineMax({});
    hamburgerAnim
    .to(hm.find('#middleLine'),0.15,{opacity:0})
    .to(hm.find('#topLine'),0.15,{y:8},'-=0.15')
    .to(hm.find('#bottomLine'),0.15,{y:-8},'-=0.15')
    .to(hm.find('#topLine'),0.15,{rotation:-45,transformOrigin:"center"})
    .to(hm.find('#bottomLine'),0.15,{rotation:45,transformOrigin:"center"},'-=0.15');
    hamburgerAnim.pause();
    
}

function initISI(){
    if(!$isi.length)
        return;

	/*collapses the isi after a user scroll past the buffer*/
	isi_compress = false;
	if ($('body').hasClass('styleguide')) {
	   isi_compress = true;
    }
    isi_compress_buffer = headerHeight;



	/*ISI control*/
    let $isiButton = $isi.find('.expand').add('.compressText');
    let $isiBottom = $isi.find('.bottomISI');
    let toggleISI = (e) => {
        e.stopPropagation();
        let $elm = $isiButton.find('img');
        $isi.toggleClass("open");
        $isiBottom.toggleClass("open");
        $elm.toggleClass("open");
        if($elm.hasClass('open')){
            bodyScroll(false);
        }else{
            bodyScroll(true);
        }
        isiToTop(500);
    };
    $isiButton.on('click', toggleISI);
    $isiButton.on('keydown', (e) => {
        if(e.which === 13 || e.which === 32 ) {
            e.preventDefault();
            toggleISI(e);
        }
    });

    // footer hide on scroll
    let isi_offset = 30;/*height of compressed isi*/
    if(!isi_compress){isi_offset = $isi.height();}
    let isi_controller = new ScrollMagic.Controller();
    new ScrollMagic.Scene({triggerElement: $isi_inline,triggerHook:1,offset:isi_offset})
        .on('enter',function(){
            isiToTop(0);
        })
        .setClassToggle($isi, "active") // add class toggle
        //.addIndicators() // add indicators (requires plugin)
        .addTo(isi_controller);

    /*isi compress*/
    if(isi_compress){
        let isi_compress_controller = new ScrollMagic.Controller();
        new ScrollMagic.Scene({triggerElement: $body,triggerHook:0,offset:isi_compress_buffer})
            .setClassToggle($isi, "compress") // add class toggle
            //.addIndicators() // add indicators (requires plugin)
            .addTo(isi_compress_controller);
    }

    /*always scrolls the ISI to the top*/
    function isiToTop(speed){
        $isiBottom.animate({scrollTop:0}, speed);
    }

}


function initHideHeader(buffer) {
    let isIE11 = !!window.MSInputMethodContext && !!document.documentMode;
    console.log('buffer = '+buffer);
    let isNow;
    let pivotST;
    let incr = 0;
    if(!isIE11){
        let lastScrollTop = 0;
        $document.on('scroll', function (event) {
            let st = $(this).scrollTop();
            //console.log('lastScrollTop = '+lastScrollTop+' : st = '+st);
            if(st>buffer && !window.menuOpen){
                if (st > lastScrollTop) {                    
                    isScrollingDown(st);
                } else {
                    isScrollingUp(st);
                }
                lastScrollTop = st;
            }
        });
    }else{
        let lastScrollTop = 0;
        $document.on('scroll', function (event) {
            let st = $(this).scrollTop();            
            //console.log('lastScrollTop = '+lastScrollTop+' : st = '+st);
            if(st>buffer && !window.menuOpen){
                if (st > lastScrollTop) {
                    lastScrollTop = st-1;
                    isScrollingDown(st);
                } else {
                    lastScrollTop = st+1;
                    isScrollingUp(st);
                }                
            }
        });
    }

    function isScrollingUp(st) {
        // once only on direction change
        if (!isUp) {            
            isUp = true;
            isDown = false;

            pivotST = st;
            isNow = incr;

            //$header.removeClass('active');
            //TweenMax.to($header, 0.25, { y: 0 });


            /*skipToContent support*/
            $skipToContent.removeClass('headerHidden');
        }

        if(incr < 0){
            incr = isNow - (st - pivotST);          
            //console.log('incr_UP = '+incr);
            if(incr >= 0){
                TweenMax.set($header, { y: 0 });                
            }else{
                TweenMax.set($header, { y: incr });                
            }
        }
    }

    function isScrollingDown(st) {
        // once only on direction change
        if (!isDown) {
            isUp = false;
            isDown = true;

            pivotST = st;
            isNow = incr;
            //$header.addClass('active');
            //TweenMax.to($header, 0.25, { y: -headerHeight});

            /*skipToContent support*/
            $skipToContent.addClass('headerHidden');
        }
        
        if(incr > -headerHeight){
            incr = isNow - (st - pivotST);            
            if (incr > 0){incr = 0;}
            //console.log('incr_DOWN = '+incr);
            TweenMax.set($header, { y: incr });
        }
        
    }
}




function webpSupport(){
//webp support
//convert images with XnConvert software (https://www.xnview.com/en/xnconvert/#downloads)
    let ext = '';
    let webpSupport = false;    
    
        
    WebpIsSupported(function(isSupported){
        if(isSupported){
            console.log('webp compatable!');
            webpSupport = true;
            ext = 'webp';
        }
        /*img tags*/
        $('img[data-webp], picture source[data-webp]').each(function(){

            let $img = $(this);
            let src = $img.attr('data-webp');
            let attr = ($img[0].tagName.toLowerCase() === 'source' ) ? 'srcset' : 'src';

            
            if(webpSupport){
                src.toString();
                src = src.substring(0, src.length - 3);
                $img.attr(attr,src+ext);
            }else{
                $img.attr(attr,src);
            }
        });



        /*anything other that img tage will assume background image*/
        $('*[data-webp]:not(img):not(picture source)').each(function(){

            let elm = $(this);
            let src = elm.attr('data-webp');

            if(webpSupport){
                src.toString();
                src = src.substring(0, src.length - 3);                
                elm.css("background-image","url('"+src+ext+"')");                
            }else{
                elm.css("background-image","url('"+src+"')");                
            }
        });

        /*SCSS controlled background images support*/
        $('.webp-bg').each(function(){
            if(webpSupport){
                $(this).addClass('webp');             
            }
            $(this).removeClass('webp-bg');             
        });

    });

    function WebpIsSupported(callback){        
        if(!window.createImageBitmap){
            if(ieVersion() >= 18){
                callback(true);    
            }else{                
                callback(false);
                return;
            }
        }
        
        let webpdata = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoCAAEAAQAcJaQAA3AA/v3AgAA=';
        
        fetch(webpdata).then(function(response){
            return response.blob();
        }).then(function(blob){            
            createImageBitmap(blob).then(function(){                
                callback(true);
            }, function(){                
                callback(false);
            });
        });
    }

    function ieVersion() { /*18+ webp support*/
      let uaString = navigator.userAgent;
      let match = /\b(MSIE |Trident.*?rv:|Edge\/)(\d+)/.exec(uaString);
      if (match) return parseInt(match[2])
    }


}


function initFormFocusSystem(){
    if(window.isMobile){
        let $theForm = $('#theForm');
        let $inputs = $theForm.find('input');
        $inputs.on('focus',function(e){
            inputFocus($(this)[0]);
        });
        $inputs.on('blur',function(e){
            inputBlur($(this)[0]);
        });

        function inputFocus(thisInput){ 
            hideInterface(true);
            $window.on('scroll.inViewPort', function (event) {
                if (isInViewport(thisInput)) {
                   console.log('checking...');
                   hideInterface(true); 
                }else{
                    console.log('out');
                    inputBlur(thisInput);
                }
            });       
            
        }
        function inputBlur(thisInput){
            thisInput.blur(); 
            $window.off('scroll.inViewPort');       
            hideInterface(false);
        }

        function hideInterface(bool){
            if(bool){
                $header.hide();
                $footer.hide();
                $isi.hide();

            }else{
                $header.show();
                $footer.show();
                $isi.show();            
            }
        }

        let isInViewport = function (elem) {
            
            var bounding = elem.getBoundingClientRect();
            return (
                bounding.top >= 0 &&
                bounding.left >= 0 &&
                bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        };

    }

}


function init(){
	/*all is initialized.... now what*/
}



/*helper funcs*/
window.alwaysScrollTo=alwaysScrollTo;
function alwaysScrollTo(speed,$elm,offset){                 
   const os = $header.height() + offset;
   /*TweenMax.to(window, speed, {scrollTo:{y:$elm,offsetY:os, autoKill:false},overwrite:'all'}); */
    $('html, body').stop();
    $('html, body').animate({
        scrollTop: $elm.offset().top - os
    }, 500);

}
window.bodyScroll=bodyScroll;		
function bodyScroll(bool){    
    if(bool){
        $html.css('overflow','auto');
        $body.css('overflow','auto');
        $body.css('overflow-y','overlay');
    }else{
        $html.css('overflow','hidden');
        $body.css('overflow','hidden');
    }
}

function grRange(min, max, div) {
    let randomNum = Math.floor(Math.random()*(max-min+1))+min;
    return randomNum/div;
}


