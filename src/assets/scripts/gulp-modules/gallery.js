import innerPageFrontEffect from '../modules/inner-pages/inner-page-front-effect';
// import * as THREE from 'three';
// import { TweenLite } from 'gsap/all';
import locoScroll from '../modules/smooth-scrolls/locoScroll';
// import sideSwitchArrow from '../modules/side-switch-arrow';
import { handleHeader } from '../modules/helpers/helpers';
import Swiper from 'swiper-legacy';
import { Parallax, Navigation, Controller } from 'swiper-legacy/modules';
import sideSwitchArrow from '../modules/sliderArrow';

innerPageFrontEffect();
window.addEventListener('DOMContentLoaded', function(evt) {
  const scroller = locoScroll('.scroller-container');
  scroller.update();
  handleHeader(scroller);
  window.scroller = scroller;
});

const slidesQuantity = document.querySelectorAll('.swiper-slide').length;

Swiper.use([Parallax, Navigation, Controller]);

const gallery = new Swiper('.gallery-swiper', {
  modules: [Parallax, Controller, Navigation],
  parallax: true,
  lazy: true,
  slidesPerView: 1,
  speed: 2000,
  loop: true,
  slidesQuantity: slidesQuantity,

  breakpoints: {
    // when window width is >= 360px
    360: {
      slidesPerView: 1,
      centeredSlides: true,
      navigation: {
        nextEl: '[data-gallery-next]',
        prevEl: '[data-gallery-prev]',
      },
    },
  },
  on: {
    init: function() {
      updSwiperNumericPagination.call(this); // Call your function when Swiper is initialized
    },
    slideChange: function() {
      updSwiperNumericPagination.call(this); // Call your function when Swiper is initialized
    },
  },
});

if (window.innerWidth > 767) {
  sideSwitchArrow(
    gallery,
    document.querySelector('[data-gallery-switcher]'),
    document.querySelector('.gallery-swiper'),
  );
}

function updSwiperNumericPagination() {
  document.querySelector('.gallery-switcher__nav').innerHTML =
    '<text fill="white" x="21" y="66">' +
    (this.realIndex + 1) +
    '</text><text fill="#858585" x="42" y="66">/</text><text fill="#858585" x="49" y="66" class="total">' +
    slidesQuantity +
    '</text>';
}

// const el = document.querySelector('.scroller-container');
// const paginations = document.querySelectorAll('[data-gallery-slide]');

// const paginationsArray = Array.from(paginations);

// paginationsArray[0].__proto__.click = function() {
//   this.dispatchEvent(new Event('click'));
// };
// const imgs = Array.from(el.querySelectorAll('[data-gallery-slide]'));
// // new displacementSlider({
// //   parent: document.querySelector('.gallery-swiper-wrapper'),
// //   images: imgs,
// // });
// const currentNavDisplay = document.querySelector('[data-gallery-switcher] text:first-child');
// const allNavDisplay = document.querySelector('[data-gallery-switcher] text:last-child');
// let currentIndex = 0;
// const galleryCanvasWrap = document.querySelector('.gallery-swiper');
// allNavDisplay.textContent = imgs.length;

// function addZeroPrefix(index) {
//   return index < 10 ? '0' + index.toString() : index;
// }
// let isAnimatingGallery = false;

// sideSwitchArrow(
//   {
//     onNext: () => {
//       if (isAnimatingGallery) return;
//       isAnimatingGallery = true;
//       currentIndex = currentIndex === imgs.length - 1 ? 0 : currentIndex + 1;
//       currentNavDisplay.textContent = addZeroPrefix(currentIndex + 1);
//       paginations[currentIndex].click();
//     },
//     onPrev: () => {
//       if (isAnimatingGallery) return;
//       isAnimatingGallery = true;
//       currentIndex = currentIndex === 0 ? imgs.length - 1 : currentIndex - 1;
//       currentNavDisplay.textContent = addZeroPrefix(currentIndex + 1);
//       paginations[currentIndex].click();
//       // console.log('prev');
//     },
//     notOnMobile: true,
//   },
//   document.querySelector('[data-gallery-switcher]'),
//   galleryCanvasWrap,
// );
// if (window.matchMedia('(max-width: 1024px)').matches) {
//   document.querySelector('[data-gallery-next]').addEventListener('click', () => {
//     if (isAnimatingGallery) return;
//     isAnimatingGallery = true;
//     currentIndex = currentIndex === imgs.length - 1 ? 0 : currentIndex + 1;
//     currentNavDisplay.textContent = addZeroPrefix(currentIndex + 1);
//     paginations[currentIndex].click();
//   });
//   document.querySelector('[data-gallery-prev]').addEventListener('click', () => {
//     if (isAnimatingGallery) return;
//     isAnimatingGallery = true;
//     currentIndex = currentIndex === 0 ? imgs.length - 1 : currentIndex - 1;
//     currentNavDisplay.textContent = addZeroPrefix(currentIndex + 1);
//     paginations[currentIndex].click();
//   });
// }
// window.addEventListener('gallery-switch-complete', function(evt) {
//   isAnimatingGallery = false;
// });
