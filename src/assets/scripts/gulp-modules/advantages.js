import innerPageFrontEffect from "../modules/inner-pages/inner-page-front-effect";
import locoScroll from '../modules/smooth-scrolls/locoScroll';
import { handleHeader, isMobile } from "../modules/helpers/helpers";
import gsap from 'gsap/all';
import Swiper, { Navigation } from 'swiper';
import splitToLinesAndFadeUp from "../modules/effects/splitToLinesAndFadeUp";
import paralax from "../modules/effects/paralax";

innerPageFrontEffect();
window.addEventListener('load',function(evt){
      const scroller = locoScroll('.scroller-container');
    scroller.update();
    handleHeader(scroller);
    window.scroller = scroller;
    // clipPathEntry('.block-img-text__img img','.scroller-container');

    // !isMobile() && webglWaves(document.querySelector('.adv-wide-block__img'));
    // !isMobile() && webglWaves(document.querySelector("div.scroller-container > div.container.adv-container > div.block-img-text.row-plain > div.block-img-text__img-wrap > div > img"), '.scroller-container');
    // !isMobile() && webglWaves(document.querySelector("div.scroller-container > div.container.adv-container > div:nth-child(1) > div.block-img-text__img-wrap > div > img"), '.scroller-container');
    // !isMobile() && webglWaves(document.querySelector("div.scroller-container > div.container.adv-container > div:nth-child(2) > div.block-img-text__img-wrap > div > img"), '.scroller-container');
    isMobile() && paralax('.advantage-mob-point__img', document.body);
    paralax('.block-img-text__img, .adv-wide-block__img', '.scroller-container');
    splitToLinesAndFadeUp('.block-img-text__text p, .adv-dark-text', '.scroller-container');
    isMobile() && splitToLinesAndFadeUp('.adv-mob-part__title,.adv-mob-part__text,.advantage-mob-point__title,.advantage-mob-point__text', document.body);
    !isMobile() && document.querySelectorAll('.block-img-text').forEach(block => {
      gsap.timeline({
          scrollTrigger: {
              scroller: '.scroller-container',
              trigger: block,
              start: '10% bottom',
              end: '90% top',
              onLeave: () => gsap.to(block.children, { y: -35, autoAlpha: 0 }),
              onLeaveBack: () => gsap.to(block.children, { y: 35, autoAlpha: 0 }),
              onEnter: () => gsap.to(block.children, { y: 0, autoAlpha: 1 }),
              onEnterBack: () => gsap.to(block.children, { y: 0, autoAlpha: 1 })
          },
      })
      
  })
});

initZoomSliderOnDesktop();
function initZoomSliderOnDesktop() {
  if (window.matchMedia('(max-width:575px)').matches) return;
  const swiper = new Swiper('.zoom-slider-wrapper', {
      // Optional parameters
  modules: [ Navigation],
  slidesPerView: 4.5,
  loop: true,
  spaceBetween: 40,
  loopedSlides: 50,
  // breakpoints: {
  //   // when window width is >= 320px
  //   // 320: {
  //   //   slidesPerView: 1.25,
  //   //   spaceBetween: 20
  //   // },
  //   // // when window width is >= 480px
  //   // 576: {
  //   //   slidesPerView: 2.5,
  //   //   spaceBetween: 20
  //   // },
  //   1440: {
  //     slidesPerView: 4.5,
  //     spaceBetween: 40
  //   }
  //   // when window width is >= 640px
  // },
  navigation: {
    nextEl: document.querySelector('[data-screen3-next]'),
    // prevEl: document.querySelector('[]'),
  },
  });
  document.querySelector('[data-screen3-prev]').addEventListener('click', () =>{
    const index = (swiper.realIndex === 0) ? swiper.loopedSlides - 1 : swiper.realIndex - 1;
    const speed = (swiper.realIndex === 0) ? 3500 : 500;
    swiper.slideToLoop(index, speed);
  })
  document.querySelector('[data-screen3-next]').addEventListener('click', () =>{
    console.log(swiper.realIndex);
  })

  
  swiper.on('touchStart', () => {
  document.querySelector('.zoom-slider-wrapper').classList.add('drag')
  
  });
  swiper.on('touchEnd', () => {
  document.querySelector('.zoom-slider-wrapper').classList.remove('drag')
  });
}