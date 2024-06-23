import innerPageFrontEffect from "../modules/inner-pages/inner-page-front-effect";
import locoScroll from '../modules/smooth-scrolls/locoScroll';
import { handleHeader } from "../modules/helpers/helpers";
import paralax from "../modules/effects/paralax";
import splitToLinesAndFadeUp from "../modules/effects/splitToLinesAndFadeUp";
import fadeInUp from "../modules/effects/fadeInUp";

innerPageFrontEffect();
window.addEventListener('load',function(evt){
      const scroller = locoScroll('.scroller-container');
    scroller.update();
    handleHeader(scroller);
    window.scroller = scroller;
    const scrollerEl = document.querySelector('.scroller-container');
    paralax('.block-img-text__img', scrollerEl);
    splitToLinesAndFadeUp('.commercial-subtitle, .commercial-text', scrollerEl);
    fadeInUp('.block-img-text__decor path', scrollerEl);
});