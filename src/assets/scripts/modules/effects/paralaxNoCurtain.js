
import {gsap, ScrollTrigger} from 'gsap/all';

gsap.registerPlugin(ScrollTrigger)
export default function paralax(selector, scroller, amplitude = 35) {
  const paralaxImages = document.querySelectorAll(selector);
  paralaxImages.forEach((image) => {
    const wrap = document.createElement('div');

    wrap.style.overflow = 'hidden';

    image.parentElement.prepend(wrap);
    wrap.prepend(image);
    gsap.set(image, { scale: 1.2});

    gsap.timeline({
      ease: 'none',
      scrollTrigger: {
        trigger: wrap,
        scrub: 0.5,
        scroller: scroller ? scroller : null,
        // markers: true,
      },
    })
      .fromTo(image, {
        y: amplitude,
      }, {
        y: amplitude * -1,
        ease: 'linear',
      });
  });
}