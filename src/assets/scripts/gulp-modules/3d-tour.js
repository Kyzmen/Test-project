import innerPageFrontEffect from '../modules/inner-pages/inner-page-front-effect';
import locoScroll from '../modules/smooth-scrolls/locoScroll';
import { handleHeader, isMobile } from '../modules/helpers/helpers';
import Swiper, { Pagination, EffectFade } from 'swiper';
import gsap from 'gsap/all';
import splitToLinesAndFadeUp from '../modules/effects/splitToLinesAndFadeUp';
Swiper.use([Pagination, EffectFade]);
innerPageFrontEffect();

window.addEventListener('load', function(evt) {
  const scroller = locoScroll('.scroller-container');
  scroller.update();
  handleHeader(scroller);
  window.scroller = scroller;
  window.addEventListener('screen1EffectFinish', function(evt) {
    // tl.play();
  });
});

var swiperPagination = document.querySelector('.swiper-pagination');
var paginationData = swiperPagination.getAttribute('data-pagination');
var pagination = paginationData.split(',');
// var pagination = [];

var mySwiper = new Swiper('.swiper-three-d', {
  effect: 'fade',
  slidesPerView: 1,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    renderBullet: function(index, className) {
      return '<div class="' + className + '">' + pagination[index] + '</div>';
    },
  },
  on: {
    init: function() {
      // При ініціалізації Swiper
      var firstSlide = this.slides[0]; // Отримуємо перший слайд
      var iframe = firstSlide.querySelector('.block-img-text__img iframe'); // Знаходимо iframe в першому слайді

      if (iframe) {
        var src = iframe.getAttribute('data-src'); // Отримуємо значення атрибута data-src
        if (src) {
          iframe.setAttribute('src', src); // Встановлюємо атрибут src для першого слайда
        }
      }
    },
    slideChange: function() {
      // При зміні слайда
      var activeSlide = this.slides[this.activeIndex]; // Отримуємо активний слайд
      var iframe = activeSlide.querySelector('.block-img-text__img iframe'); // Знаходимо iframe в активному слайді

      if (iframe) {
        var src = iframe.getAttribute('data-src'); // Отримуємо значення атрибута data-src
        if (src) {
          iframe.setAttribute('src', src); // Встановлюємо атрибут src для початку завантаження iframe
        }
      }

      // Видаляємо атрибут src з iframe у всіх інших слайдах
      for (var i = 0; i < this.slides.length; i++) {
        if (i !== this.activeIndex) {
          var otherIframe = this.slides[i].querySelector('.block-img-text__img iframe');
          if (otherIframe) {
            otherIframe.removeAttribute('src');
          }
        }
      }
    },
  },
});
