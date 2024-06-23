import innerPageFrontEffect from "../modules/inner-pages/inner-page-front-effect";
import locoScroll from '../modules/smooth-scrolls/locoScroll';
import { handleHeader } from "../modules/helpers/helpers";
import Swiper, { Navigation } from 'swiper';

innerPageFrontEffect();
window.addEventListener('load',function(evt){
      const scroller = locoScroll('.scroller-container');
    scroller.update();
    handleHeader(scroller);
    window.scroller = scroller;
});


function handleSingleNewsSlider() {

  console.log('s');
  var swiper = new Swiper(".single-news-container__slider", {
    modules: [ Navigation],
    slidesPerView: 1,
    spaceBetween: 0,
    navigation: {
        nextEl: document.querySelector('.single-news-container__slider-nav svg:nth-child(2)'),
        prevEl: document.querySelector('.single-news-container__slider-nav svg:nth-child(1)'),
    },
    on: {
      init:(e) => {
        console.log(e);
        e.navigation.nextEl.classList.add('visible');
        e.navigation.prevEl.classList.add('visible');
      }
    },
    roundLengths: true,
  });
}
const counterOfSlides = document.querySelector('.swiper-wrapper').children.length;
(counterOfSlides > 1) && handleSingleNewsSlider()
