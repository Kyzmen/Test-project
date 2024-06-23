
// import {gsap, ScrollTrigger} from 'gsap/all';

export default function paralax(selector, scroller, amplitude = 35) {
  // gsap.registerPlugin(ScrollTrigger)
  const paralaxImages = document.querySelectorAll(selector);
  paralaxImages.forEach((image) => {
    const wrap = document.createElement('div');

    wrap.style.overflow = 'hidden';
    const curtain = document.createElement('div');
    wrap.classList.add('image-with-curtain-in');
    // console.log();
    curtain.classList.add('curtain');
    image.parentElement.prepend(wrap);
    wrap.append(curtain);

    wrap.prepend(image);
    gsap.set(image, { autoAlpha: 0, scale: 1.2});
    gsap.set(curtain, { 
      // position: 'relative',
      width: image.getBoundingClientRect().width,
      marginRight: getComputedStyle(image).marginRight,
      height: image.getBoundingClientRect().height,
      // backgroundColor: curtainColor ? curtainColor : '',
    });

    
    gsap.timeline({
      scrollTrigger: {
        trigger: image,
        start: '20% bottom',
        once: true,
        scroller: scroller ? scroller : null,
      }
    })
      .to(curtain, { scaleY: 1, duration: 1,  ease: 'expo.out' })
      .to(curtain, { scaleY: 0, duration: 1,  ease: 'expo.out', transformOrigin: '50% 0%' })
      .to(image, { autoAlpha: 1 }, '<')
    // .add(() => curtain.remove())
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