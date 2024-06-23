import Lenis from './lenis-lib';
import { gsap, ScrollTrigger } from 'gsap/all';

export default function locoScroll(selector) {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }
    
    requestAnimationFrame(raf)


    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    return {
      destroy() {},
      start(){},
      stop(){},
      scrollTo(digit) {
        console.log('digit', typeof digit);
        if (digit instanceof Element) {
          digit.scrollIntoView({ behavior: 'smooth' });
          return;
        }
        window.scrollTo(0, digit);
      },
      update() {},
      on(eventName, cb) {
        window.addEventListener(eventName, (eventt) => {
          cb({
            scroll: {
              y: window.scrollY
            }
          })
        });
      },
    }
}