import { gsap, ScrollTrigger } from 'gsap/all';
// import ScrollTrigger from 'gsap/ScrollTrigger';

import paralax from '../modules/effects/paralax';
import paralaxNoCurtains from '../modules/effects/paralaxNoCurtain';
import fadeInUp from '../modules/effects/fadeInUp';
import splitToLinesAndFadeUp from '../modules/effects/splitToLinesAndFadeUp';
import galleryEffect from '../modules/home/gallery';
import screen3Effects from './home/screen3';
import screen4 from './home/screen4';
import screen5 from './home/screen5';
import screen6 from './home/screen6';
import screen10 from './home/screen10';
import locoScroll from '../modules/smooth-scrolls/locoScroll';
import screen9Handler from './home/screen9';
import screen1 from './home/screen1';
import screen8 from './home/screen8';
import {
  addIntersectionOnceWithCallback,
  handleHeader,
  transitionBetweenSectionSceneLength,
} from '../modules/helpers/helpers';
// import genplanSequence from '../modules/genplan-sequence/genplan-sequence';
import screen55 from './home/screen55';

// import paralax from '../../../../../forest-home-site/src/assets/scripts/modules/animation/effect/paralax';

window.addEventListener('load', homeInit);
const appHeight = () => {
  const doc = document.documentElement;
  doc.style.setProperty('--app-height', `${window.innerHeight}px`);
};
window.addEventListener('resize', appHeight);
appHeight();

const video = document.querySelector('.main-screen__video');

const soundButton = document.querySelector('.section-1__video-button');
const offIcon = document.querySelector('.section-1__video-button-off');
const onIcon = document.querySelector('.section-1__video-button-on');

let hasUserInteracted = false;

function toggleSound() {
  if (video.muted) {
    video.muted = false;
    offIcon.style.display = 'none';
    onIcon.style.display = 'block';
  } else {
    video.muted = true;
    offIcon.style.display = 'block';
    onIcon.style.display = 'none';
  }
}

function handleUserInteraction() {
  if (!hasUserInteracted) {
    // Взаємодія користувача: запускаємо відтворення відео
    video.play();
    hasUserInteracted = true;
  }
}

soundButton.addEventListener('click', toggleSound);
video.addEventListener('play', () => {
  // Відтворення розпочалося, можна виконувати додаткові дії, якщо потрібно
});
video.addEventListener('touchstart', handleUserInteraction);
video.addEventListener('click', handleUserInteraction);

function homePreloaderEffect() {
  const isMobile = window.matchMedia('(max-width:575px)').matches;
  gsap.set('.page__inner', { pointerEvents: 'none' });
  return (
    gsap
      .timeline({
        paused: true,
        defaults: {
          ease: 'power4.out',
          duration: isMobile ? 1.5 : 3,
          clearProps: 'all',
        },
      })
      // .fromTo('.header>svg', { xPercent: -100, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1 })
      .fromTo(
        '.langs-header, .header>button, .header>a:not(.header-logo), .header [data-call-mobile-callback-popup]',
        { x: 250, autoAlpha: 0 },
        { x: 0, autoAlpha: 1 },
        '<',
      )
      .fromTo('.main-screen__render', { yPercent: 30 }, { yPercent: 0, autoAlpha: 1 }, '<')
      .fromTo('.main-screen__cloud-1', { xPercent: 30 }, { xPercent: 0, autoAlpha: 1 }, '<')
      .fromTo(
        '.main-screen__text>*:not(button)',
        {
          autoAlpha: 0,
          y: 150,
        },
        {
          autoAlpha: 1,
          y: 0,
          clearProps: 'all',
        },
        '<',
      )
      .fromTo(
        '.main-screen__text>.button',
        {
          // autoAlpha: 0
        },
        {
          // autoAlpha: 1,
          duration: 1.5,
        },
        '<',
      )
      .add(() => {
        window.dispatchEvent(new Event('preloaderEffectFinish'));
        window.preloaderFinished = true;
      })
  );
  // .fromTo('.main-screen', { yPercent: 20}, { yPercent: 0}, '<')
}
window.addEventListener('preloaderOff', function(evt) {
  if (sessionStorage.getItem('home-play') === null) {
    homePreloaderEffect().play();
    sessionStorage.setItem('home-play', true);
    return;
  }
  window.dispatchEvent(new Event('preloaderEffectFinish'));
  window.preloaderFinished = true;
});
function homeInit() {
  global.gsap = gsap;
  gsap.core.globals('ScrollTrigger', ScrollTrigger);
  const isTablet = () => window.matchMedia('(max-width: 1024px)').matches;
  const isMobile = () => window.matchMedia('(max-width: 575px)').matches;

  const scroller = locoScroll('.scroller-container');
  scroller.update();
  window.scroller = scroller;
  const $scroller = isMobile() ? document.body : document.body; //document.querySelector('.scroller-container');

  var scrollBtn = document.querySelector('.button-down');

  if (isMobile()) {
    scrollBtn.addEventListener('click', e => {
      e.preventDefault();
      scrollToSectionMobile('.screen2');
    });
  } else {
    scrollBtn.addEventListener('click', e => {
      e.preventDefault();
      scrollToSection('.screen2');
    });
  }

  function scrollToSectionMobile(sectionId) {
    var section = document.querySelector(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }

  function scrollToSection(sectionId) {
    const targetSection = document.querySelector(sectionId);
    if (targetSection) {
      scroller.scrollTo(targetSection);
    }
  }

  screen1($scroller);

  galleryEffect($scroller);
  screen3Effects($scroller);
  screen4($scroller);
  screen5($scroller);
  screen6($scroller);
  ScrollTrigger.create({
    once: true,
    scroller: $scroller,
    trigger: '.screen9',
    onEnter: () => scroller.update(),
  });
  screen8($scroller);
  paralax('.screen8 .img-right img:first-child', $scroller, 20);
  paralax('.screen8 .img-center img:first-child', $scroller, 20);
  paralax('.screen8 .img-left img:first-child', $scroller, 20);
  screen9Handler($scroller);
  screen10($scroller);
  paralax('.img-center img', $scroller);

  /**Screen2 effects */
  // !isMobile() && gsap.timeline({
  //   scrollTrigger: {
  //     trigger: '.screen2',
  //     scroller: $scroller,
  //     scrub: true,
  //     // markers: true,
  //     ...transitionBetweenSectionSceneLength(),
  //   }
  // })
  //   .from('.screen2>*', { y: 30, autoAlpha: 0})
  console.log(document.querySelector('.screen2'));
  // ScrollTrigger.create({
  //   trigger: '.screen2',
  //   scroller: $scroller,
  //   end: '100% 12.5%',
  //   onLeave: () => {
  //     gsap.to('.screen2>*', { y: -50, autoAlpha: 0 });
  //   },
  //   onEnterBack: () => {
  //     gsap.to('.screen2>*', { y: 0, autoAlpha: 1 });
  //   },
  // });
  paralaxNoCurtains('.screen2 .img-with-logo:first-child img', $scroller, 80);
  paralaxNoCurtains('.screen2 .img-with-logo:last-child img', $scroller, 40);
  /**Screen2 effects END */
  // const frames = document.querySelectorAll('[data-vr-frame]');
  // frames.forEach(frame => {
  //   frame.addEventListener('click', function changeSrc() {
  //     const iframe = frame.querySelector('iframe');
  //     const frameOtherEls = frame.querySelectorAll(':not(iframe)');
  //     gsap.to(frameOtherEls, { y: 50, autoAlpha: 0, clearProps: 'transform' })
  //     iframe.src = iframe.dataset.src;
  //     frame.removeEventListener('click', changeSrc);
  //   })
  // })
  // splitToLinesAndFadeUp('.title,.title-h2, .subtitle');
  // fadeInUp('.screen11__group, .screen11 .title-h2', $scroller);
  // splitToLinesAndFadeUp('.main-screen .title', $scroller);
  splitToLinesAndFadeUp(
    '.screen7-title, .screen5-hor-block__item-text .title, :not(.main-screen) .title-h2, .screen8__text .text-white, .screen8__text .title',
    $scroller,
  );

  
  if (isMobile()) {
    addIntersectionOnceWithCallback(document.querySelector('.screen5-5-mobile'), () => {
      screen55(document.body);
    });
  } else {

    if (document.querySelector('.screen3').getBoundingClientRect().top < 0) {
      screen55(document.body);
    } else {
      addIntersectionOnceWithCallback(document.querySelector('.screen3'), () => {
        screen55(document.body);
      });

    }
  }

  handleHeader(scroller);

  function sectionTransitions() {
    const sections = document.querySelectorAll('.scroller-container>*');
    const sectionEntersEffect = {
      0: section => {},
      1: section => {},
      2: section => {},
      3: section => {},
      4: section => {
        return gsap
          .timeline()
          .fromTo(section.querySelector('.screen5-hor-block__item'), { y: 50 }, { y: 0 });
      },
      5: section => {
        return gsap.timeline().fromTo(section.querySelector('.genplan__text'), { y: 50 }, { y: 0 });
      },
      6: section => {},
      7: section => {},
      8: section => {},
      9: section => {},
    };
    sections.forEach((singleSection, index) => {
      gsap.timeline({
        scrollTrigger: {
          trigger: singleSection,
          scroller: $scroller,
          scrub: true,
          start: '-100px top',
          end: '50px top',
        },
      });
      // .add(sectionEntersEffect[index](singleSection))
      // .fromTo(
      //   singleSection.previousElementSibling,
      //   { clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)' },
      //   { clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)' },
      // );
    });
  }
  sectionTransitions();

  function hoverParalax(params = {}) {
    const { degree = 3, selector } = params;
    const img = typeof selector === 'string' ? document.querySelector(selector) : selector;
    const parent = img.parentElement;
    gsap.set(parent, { perspective: '500px' });

    img.addEventListener('mousemove', ({ clientX, clientY }) => {
      const { left, right, top, bottom } = img.getBoundingClientRect();
      var mapper = gsap.utils.mapRange(left, right, degree * -1, degree);
      var mapperH = gsap.utils.mapRange(top, bottom, degree, degree * -1);
      gsap.set(img, { rotateY: mapper(clientX), rotateX: mapperH(clientY) });
    });
    img.addEventListener('mouseleave', function(evt) {
      gsap.to(img, { rotateY: 0, rotateX: 0 });
    });
  }

  gsap.utils.toArray('.screen5-hor-block__item img').forEach(el => {
    hoverParalax({
      degree: 4,
      selector: el,
    });
  });

  // !isMobile() && gsap.timeline({
  //   scrollTrigger: {
  //     trigger: '.screen11',
  //     // start: `${innerHeight / -4} center`,
  //     // end: `${innerHeight / 4} center`,
  //     ...transitionBetweenSectionSceneLength(),
  //     scroller: $scroller ? $scroller : null,
  //     scrub: true,
  //   }
  // })
  // .to('.screen10>*', { y: isMobile() ? -20 : -75, autoAlpha:  isMobile() ? 0.5 : 0 })
  // .fromTo('.screen11>*:not(.section-decor)', { y: 75, autoAlpha: 0 }, { y: 0, autoAlpha: 1 }, '<');

  document.querySelectorAll('[data-up-arrow]').forEach(handleUpArrow);
  function handleUpArrow(arrow) {
    const isTablet = window.matchMedia('(max-width: 1024px)').matches;

    arrow.addEventListener('click', () => {
      isTablet ? windowScrollUp() : locoScrollUp();
      window.dispatchEvent(new Event('scroll-top-reach'));
    });
    function locoScrollUp() {
      if (window.scroller !== undefined) {
        window.scroller.scrollTo(0);
      }
    }
    function windowScrollUp() {
      window.scrollTo(0, 0);
    }
    gsap.timeline({
      scrollTrigger: {
        trigger: '.screen3',
        start: 'bottom bottom',
        end: 'bottom bottom',
        scroller: $scroller ? $scroller : null,
        onEnter: () => {
          gsap.to(arrow, { autoAlpha: 1 });
        },
        onLeaveBack: () => {
          gsap.to(arrow, { autoAlpha: 0 });
        },
      },
    });
    // ScrollTrigger.create({
    //   trigger: '.screen3',
    //   start: 'bottom bottom',
    //   end: 'bottom bottom',
    //   pin: false,
    //   scroller: $scroller ? $scroller : null,
    //   onEnter: () => {
    //     gsap.to(arrow, { autoAlpha: 1 })
    //   },
    //   onLeaveBack: () => {
    //     gsap.to(arrow, { autoAlpha: 0 })
    //   },
    // })
  }
}
