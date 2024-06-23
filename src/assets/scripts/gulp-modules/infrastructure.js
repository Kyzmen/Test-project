import innerPageFrontEffect from "../modules/inner-pages/inner-page-front-effect";
import locoScroll from '../modules/smooth-scrolls/locoScroll';
import { handleHeader, addIntersectionOnceWithCallback } from "../modules/helpers/helpers";
import googleMap from "../modules/map/map";
import paralax from "../modules/effects/paralax";
import splitToLinesAndFadeUp from "../modules/effects/splitToLinesAndFadeUp";
import markerslayout from "../modules/infrastructure/markersLayout";
import screen55 from "./home/screen55";

innerPageFrontEffect();
googleMap();
markerslayout('.map-wrapper__nav');
window.addEventListener('load',function(evt){
  
      const scroller = locoScroll('.scroller-container');
    scroller.update();
    handleHeader(scroller);
    window.scroller = scroller;
    paralax('.block-img-text__img img', '.scroller-container');
    splitToLinesAndFadeUp('.block-img-text__text p, .infra-title, .infra-text p', '.scroller-container');
    disableScroll(scroller);
    const $scroller = document.querySelector('.scroller-container');
    // screen6($scroller);
    // addIntersectionOnceWithCallback(document.querySelector('.genplan'),() => {
    // })
    screen55(document.body);
});
function disableScroll(locoScroll) {
    const containersScroll = document.querySelectorAll('[data-disable-page-scroll]');
    containersScroll.forEach((block) => {
      block.addEventListener('mouseenter', () => {
        locoScroll.stop();
      });
      block.addEventListener('mouseleave', () => {
        locoScroll.start();
      });
    });
  }
  /** ******************************* */




document.querySelector('[data-mob-wrapper-mobile-opener]').addEventListener('click',function(evt){
  const navContainer = document.querySelector('.map-wrapper__nav');
  navContainer.classList.toggle('closed');
  this.querySelector('span').textContent = navContainer.classList.contains('closed') ? this.dataset.closedText : this.dataset.openedText;
});