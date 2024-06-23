import gsap from "gsap/all";
import { transitionBetweenSectionSceneLength } from "../../modules/helpers/helpers";

export default function screen8(scroller) {
    const  screen1 = document.querySelector('.screen8');
    const isMobile = window.matchMedia('(max-width: 575px)').matches;




    // if (screen1 === null || window.matchMedia('(max-width: 1024px)').matches) return;
    const cloud1 = screen1.querySelector('.screen8__clouds'),
        render = screen1.querySelector('.screen8__render'),
        textBlock = screen1.querySelector('.screen8__text');


    isMobile && gsap.timeline({
        scrollTrigger: {
            scroller: scroller ? scroller : null,
            trigger: cloud1,
            scrub: true,
            // end: `${screen1.getBoundingClientRect().height} bottom`
        }   
    })
        .to(cloud1, { xPercent: -35, yPercent: 20 })
        .fromTo('.screen8 .img-left', { y: 75 }, { y: -75 }, '<')
    !isMobile && gsap.timeline({
        scrollTrigger: {
            scroller: scroller ? scroller : null,
            trigger: screen1,
            scrub: true,
            start: `${innerHeight} bottom`,
            // end: `${screen1.getBoundingClientRect().height} bottom`
        }   
    })
    .to(textBlock, { yPercent: -50, autoAlpha: 0.5 })
    
    .to(render, { y: 250, transformOrigin: '100% 100%' }, '<');


    !isMobile && gsap.timeline({
        scrollTrigger: {
            scroller: scroller ? scroller : null,
            trigger: cloud1,
            scrub: true,
        }   
    })
        .to(cloud1, { xPercent: -35, yPercent: 20 })
    // !isMobile && gsap.timeline({
    //     scrollTrigger: {
    //         scroller: scroller ? scroller : null,
    //         trigger: screen1,
    //         scrub: true,
    //         // start: `${innerHeight / -4} center`,
    //         // end: `${innerHeight / 4} center`
    //         ...transitionBetweenSectionSceneLength(),
    //         // end: `${screen1.getBoundingClientRect().height} bottom`
    //     }   
    // })
    // .from('.img-left img:first-child, .img-left .img-left__decor, .img-center, .img-right', {  yPercent: 7.5, stagger: 0.1  })
    // .to('.screen7__head-block, .screen7__faded-title', { autoAlpha: 0, y: 50, }, '<');

    gsap.timeline({
        scrollTrigger: {
            trigger: '.screen8',
            once: true,
            scroller: scroller ? scroller : null,
            onEnter: () => {
                console.log('enter');
                if (document.querySelector('[data-screen8-src]') === null) return;
                document.querySelector('[data-screen8-src]').src = document.querySelector('[data-screen8-src]').dataset.screen8Src;
            }
        }
    })

    !isMobile && gsap.timeline({
        scrollTrigger: {
            scroller: scroller ? scroller : null,
            trigger: '.screen8 .img-left',
            scrub: true,
            onEnter: () => {
                // console.log('fff');
            }
        }
    })
        .fromTo('.screen8 .img-left', { y: 75 }, { y: -75 })
        .fromTo('.screen8 .img-right', { y: 75 }, { y: -75 }, '<')
    
}