import splitToLinesAndFadeUp from "../../modules/effects/splitToLinesAndFadeUp";
import { transitionBetweenSectionSceneLength } from "../../modules/helpers/helpers";
import Swiper, {FreeMode } from 'swiper';
import ztext from "../../modules/ztext/ztext";

export default function screen5(scroller) {
    const innerHorizontalItems = gsap.utils.toArray('.screen5-hor-block__item:nth-child(n+2)');
    // const screen5TopBlockHeight = document.querySelector('.screen5__inner-top').getBoundingClientRect().height;
    const screen5TopBlockHeight = 0;
    const isMobile = window.matchMedia('(max-width: 575px)').matches;
    // !isMobile && gsap.timeline({
    //   scrollTrigger: {
    //     trigger: '.screen5',
    //     scrub: true,
    //     scroller: scroller ? scroller : null,
    //     // start: `${innerHeight / -4} center`,
    //     // end: `${innerHeight / 4} center`,
    //     ...transitionBetweenSectionSceneLength(),
    //     // onUpdate: ({ progress }) => console.log(progress)
    //   //   markers: true
    //   }
    // })
      // .from('.screen5 .title-h2', { yPercent: 100, autoAlpha: 0, })
      // .from('.screen5-hor-block', { yPercent: 10, autoAlpha: 0.5, }, '<')
    !isMobile && gsap.timeline({
      scrollTrigger: {
        trigger: '.screen6',
        scrub: true,
        scroller: scroller ? scroller : null,
        // start: `${screen5TopBlockHeight} top`,
        end: `${innerHeight} bottom`,
        // onUpdate: ({ progress }) => console.log(progress)
      //   markers: true
      }
    })
      // .to('.screen5-hor-block', { y: -75, autoAlpha: 0.5, }, '<')
      // .from('.genplan__text, .genplan__img', { autoAlpha: 0, y: 85 })
      // .to('.screen5', { y: -50, autoAlpha: 0, }, '<')
      // .to('.genplan-curtain-for-prev-block-anim', { scaleY: 0,}, '<')
    !isMobile && gsap.timeline({
        scrollTrigger: {
          trigger: '.screen5',
          scrub: true,
          scroller: scroller ? scroller : null,
          start: `${screen5TopBlockHeight} top`,
          end: `${document.querySelector('.screen5').getBoundingClientRect().height} bottom`,
          pin: '.screen5__inner',
          // onUpdate: ({ progress }) => console.log(progress)
        //   markers: true
        }
      })
      // .fromTo('.screen5 .title-h2',  { yPercent: 0, autoAlpha: 1 }, { yPercent: -100, autoAlpha: 0, duration: 0.1 })
      .to('.screen5-hor-block', { x: (el, target) => {
        const horBlocksItems = document.querySelectorAll('.screen5-hor-block__item');
        
        // return (horBlocksItems[0].getBoundingClientRect().width) * (horBlocksItems.length - 1) * -1;
        return innerWidth + Array.from(horBlocksItems).reduce((acc, el) => {
          acc -= el.getBoundingClientRect().width;
          return acc;
        }, 0);
      },ease: 'none' }, '<')
    isMobile && mobileSlider();
}


function mobileSlider() {
      const slideWrapper = document.querySelector('.screen5-hor-block');
      const swiperWrapper = document.createElement('div');
      swiperWrapper.classList.add('swiper-wrapper');
      slideWrapper.append(swiperWrapper);
      document.querySelectorAll('.screen5-hor-block__item').forEach(el => {
        el.classList.add('swiper-slide');
        swiperWrapper.append(el);
      })
      const swiper = new Swiper('.screen5-hor-block', {
        // Optional parameters
        modules: [FreeMode ],
        slidesPerView: 'auto',
        // loop: true,
        freeMode: true,
        spaceBetween: 0,
        
    });
}