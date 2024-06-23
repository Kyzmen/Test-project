import gsap from 'gsap/all';
import Swiper, { Navigation } from 'swiper';
import { transitionBetweenSectionSceneLength } from '../../modules/helpers/helpers';
export default function screen3Effects(scroller) {
    const isMobile = window.matchMedia('(max-width: 575px)').matches;
    const swiper = new Swiper('.zoom-slider-wrapper', {
        // Optional parameters
    modules: [ Navigation],
    slidesPerView: 4.5,
    loop: true,
    spaceBetween: 40,
    breakpoints: {
      // when window width is >= 320px
      320: {
        slidesPerView: 1.5,
        spaceBetween: 20
      },
      // when window width is >= 480px
      993: {
        slidesPerView: 3.5,
        spaceBetween: 30
      },
      1440: {
        slidesPerView: 4.5,
        spaceBetween: 40
      }
      // when window width is >= 640px
    },
    navigation: {
      nextEl: document.querySelector('[data-screen3-next]'),
      prevEl: document.querySelector('[data-screen3-prev]'),
    },
  });
  swiper.on('touchStart', () => {
    document.querySelector('.zoom-slider-wrapper').classList.add('drag')
  
  });
  swiper.on('touchEnd', () => {
    document.querySelector('.zoom-slider-wrapper').classList.remove('drag')
  });
  if (!isMobile) {
    gsap.set('.screen3>*:not(.section-decor)', { y: 50, autoAlpha: 0 })
    gsap.timeline({
      scrollTrigger: {
        trigger: '.screen3',
        // markers: true,
        scroller: scroller ? scroller : null,
        end: '100% 20%',
        onEnter: () => {
          gsap.to('.screen3>*:not(.section-decor)', { y: 0, autoAlpha: 1 })
        },
        onLeaveBack: () => {
          gsap.to('.screen3>*:not(.section-decor)', { y: 50, autoAlpha: 0 })
        },
        onLeave: () => {
          gsap.to('.screen3>*:not(.section-decor)', { y: -50, autoAlpha: 0 })
        },
        onEnterBack: () => {
          gsap.to('.screen3>*:not(.section-decor)', { y: 0, autoAlpha: 1 })
        }
      }
    })
  }
    // .from('.screen3>*:not(.section-decor)', { scale: 1, autoAlpha: isMobile ? 0.5 : 0, y: isMobile ? 0 : 50, clearProps: 'transform' })
    // .to('.screen2>*:not(.section-decor)', { autoAlpha: isMobile ? 0.5 : 0, y: -50 }, '<')
}