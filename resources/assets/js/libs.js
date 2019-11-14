import 'jquery';
window.$ = window.jQuery;

import 'bootstrap/dist/js/bootstrap';

import TweenMax from 'gsap';

import ScrollMagic from 'scrollmagic';
window.ScrollMagic = ScrollMagic;

/*these plug-ins are referencing aliases found in the webpack.config.js file*/
/*import 'animation.gsap';
import 'debug.addIndicators';*/


/* to fix IE 11 bugs, specifically with slick slider */
import 'custom-event-polyfill';
/* to fix IE 11 bugs */

import MobileDetect from 'mobile-detect/mobile-detect';
import 'js-throttle-debounce/src/js-throttle-debounce';
import 'slick-carousel/slick/slick';