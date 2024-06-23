import {gsap, ScrollTrigger} from "gsap/all";
import { transitionBetweenSectionSceneLength } from "../../modules/helpers/helpers";
const videoChangeStateEvent = new CustomEvent('toggle');
export default function screen4(scroller) {
    const isMobile = window.matchMedia('(max-width: 575px)').matches;
      !isMobile && gsap.timeline({
        scrollTrigger: {
          trigger: '.screen4',
          scrub: true,
          start: '0 bottom',
          scroller: scroller ? scroller : null,
          // start: '0 top',
          end: `${document.querySelector('.screen4').getBoundingClientRect().height} bottom`,
          // pin: '.screen4__inner',
          // pinSpacing: false,
          // markers: true
        }
      })
        .from('.screen4__title :first-child', { x: '-100vw' })
        .from('.screen4__title :last-child', { x: '100vw' }, '<')
        .fromTo('.screen4__video', { scale: 0.8 }, { scale: 1 })
        .to('.screen4__title :last-child', { z: 0 });

      isMobile && gsap.timeline({
        scrollTrigger: {
          trigger: '.screen4',
          scrub: true,
          start: `0 bottom`, 
          end: `${innerHeight} bottom`, 
          scroller: scroller ? scroller : null,
          // markers: true,
          // start: '0 top',
        //   markers: true
        }
      })
        .from('.screen4__title :first-child', { x: '-100vw' })
        .from('.screen4__title :last-child', { x: '100vw' }, '<')
        .fromTo('.screen4__video', { scale: 0.8 }, { scale: 1 })
        .to('.screen4__title :last-child', { z: 0 })
      
      document.querySelectorAll('[data-screen4-video]').forEach(el => {
        const video = el.querySelector('video');
        video.addEventListener(videoChangeStateEvent.type, ({ target }) => {
          if (video === null) return;
          video.paused ? video.play() : video.pause();
          gsap.to('.screen4__video-play, .screen4__title',  { autoAlpha:  video.paused ? 1 : 0  })
          gsap.set('.screen4__video',  { zIndex:  video.paused ? 0 : 3  })
        });
        el.addEventListener('click', () => {
          video.dispatchEvent(videoChangeStateEvent);
        });
        ScrollTrigger.create({
          trigger: '.screen4',
          scroller: scroller ? scroller : null,
          onLeave: () => {
            if (!video.paused) video.dispatchEvent(videoChangeStateEvent);
          },
          onLeaveBack: () => {
            if (!video.paused) video.dispatchEvent(videoChangeStateEvent);
          }
        })
      });

      // !isMobile && gsap.timeline({
      //   scrollTrigger: {
      //     trigger: '.screen4',
      //     scrub: true,
      //     scroller: scroller ? scroller : null,
      //     ...transitionBetweenSectionSceneLength(),
      //   }
      // })
      //   .from('.screen4>*:not(.section-decor)', { autoAlpha: isMobile ? 0.5 : 0, y: isMobile ? 0 : 50, clearProps: 'transform' })
      //   .to('.screen3>*:not(.section-decor)', { autoAlpha: isMobile ? 0.5 : 0, y: isMobile ? 0 : -50}, '<')
}