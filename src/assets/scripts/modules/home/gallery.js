import {gsap, ScrollTrigger} from 'gsap/all';
import { transitionBetweenSectionSceneLength } from '../helpers/helpers';
export default function galleryEffect(scroller) {


    gsap.config({
        force3D: false,
    })
    const isMobile = window.matchMedia('(max-width: 1024px)').matches;
    const isTablet = window.matchMedia('(max-width: 1024px) and (min-width: 576px)').matches;
    // if (window.matchMedia('(max-width: 575px)').matches) return;
    const gallery = document.querySelector('.screen7');
    !isMobile && gsap.set(gallery, { height: '250vh' });
    const inner = gallery.querySelector('.screen7__content');
    const right = gallery.querySelector('.screen7__right-block'),
        left = gallery.querySelector('.screen7__left-block'),
        center = gallery.querySelector('.screen7__head-block'),
        centerImg = center.querySelector('img'),
        fadedTitle = gallery.querySelector('.screen7__faded-title'),
        centerText = gallery.querySelector('.screen7__head-block-text');
        ;
    
    const sideImagesScaleValue = 1.7;
    const centerRatio = innerWidth*0.95 / center.getBoundingClientRect().width;
    // const imgScaleRatio = 
    !isMobile && gsap.timeline({
        ease: 'linear',
        defaults: {
            ease: 'linear'
        },
        scrollTrigger: {
            trigger: gallery,
            scroller: scroller ? scroller : null,
            start: `${getComputedStyle(gallery).paddingTop} top`,
            scrub: true,
            end: `${gallery.getBoundingClientRect().height} bottom`,
            pinSpacing: false,
            pin: inner
        }
    })
    // isMobile ? centerRatio * 2 : centerRatio * 1.45
     .to(centerImg, { scale: () => {
         if (isTablet) return 1.5;
         return isMobile ? centerRatio * 2 : centerRatio * 1.45;
     }, transformOrigin: '50% 100%' })
     .to(center, { scale: centerRatio, transformOrigin: '50% 100%' }, '<')
    .to(left, { xPercent: -51, ease: 'linear' },'<')
    .to(
        left.querySelectorAll('img'), 
        { scale: sideImagesScaleValue, transformOrigin: '100% 50%', ease: 'linear' },
        '<'
    )
    .to(
        right.querySelectorAll('img:first-child'), 
        { scale: sideImagesScaleValue, transformOrigin: '0% 100%', ease: 'linear' },
        '<'
    )
    .to(
        right.querySelectorAll('img:last-child'), 
        { scale: sideImagesScaleValue, transformOrigin: '0% 0%', ease: 'linear' },
        '<'
    )
    .to(right, { xPercent: 51, ease: 'linear' }, '<')
    .fromTo(fadedTitle, { autoAlpha: 0, y: 150 },{ autoAlpha: 1, y: 0, duration: 0.2 }, '<+0.5')
    // .to(right, { xPercent: 100, duration: 0.5 }, )
    
    isMobile && gsap.timeline({
        scrollTrigger: {
            trigger: gallery,
            scroller: scroller ? scroller : null,
            scrub: true,
            start: `0 bottom`, 
            end: `${innerHeight} bottom`, 
        }
    })
    .to(centerImg, {  scale: () => {
        if (isTablet) return 1.5;
        return isMobile ? centerRatio * 2 : centerRatio * 1.45;
    }})
    .to(center, { scale: centerRatio, transformOrigin: '50% 100%' }, '<')
   //  .to(centerText, { scale: center.getBoundingClientRect().width / innerWidth, autoAlpha: 1, duration: 0.25 }, '<')
   // .to(centerImg, { scale: 1.3 }, '<')
    .to(left, { xPercent: -55, autoAlpha: 0, ease: 'linear' },'<')
    .to(right, { xPercent: 55, autoAlpha: 0, ease: 'linear' }, '<')
    .fromTo(fadedTitle, { autoAlpha: 0, y: 150 },{ autoAlpha: 1, y: 0 }, '<')

    // !isMobile && gsap.timeline({
    //     scrollTrigger: {
    //         trigger: gallery,
    //         // end: `${innerHeight / 5}`,
    //         scroller: scroller ? scroller : null,
    //         scrub: true,
    //         // start: `${innerHeight / -4} center`,
    //         // end: `${innerHeight / 4} center`
    //         ...transitionBetweenSectionSceneLength(),
    //     }
    // })
    // .to('.genplan__text, .genplan__img', { y: -100, autoAlpha: isMobile ? 0.5 : 0 })
    // .from('.screen7__content', { y: isMobile ? 50 : 200, autoAlpha: 0 }, '<')
    // .from('.screen7 .title-h2', { y: isMobile ? 50 : 200, autoAlpha: 0 },'<')
}

