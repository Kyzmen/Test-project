import {gsap, ScrollTrigger} from "gsap/all";

export default function screen1(scroller) {
    const  screen1 = document.querySelector('.main-screen');
    const isMobile = window.matchMedia('(max-width: 575px)').matches;
    if (screen1 === null) return;
    const cloud1 = screen1.querySelector('.main-screen__cloud-1'),
        render = screen1.querySelector('.main-screen__render'),
        textBlock = screen1.querySelector('.main-screen__text');
    Array.from(textBlock.children).forEach((el, index, arr) => {
        if (index === arr.length - 1) {
            textBlock.append(el);
            return;
        }
        const wrapper = wrap(el);
        gsap.set(wrapper, { overflow: 'hidden' });
        textBlock.append(wrapper);
    })
    // screen1.append(wrap)
    const innerHeight = window.innerHeight;
    const tlScreen1 = gsap.timeline({
        // paused: true,
        scrollTrigger: {
            scroller: scroller ? scroller : null,
            trigger: screen1,
            scrub: true,
            start: isMobile ? `0 top` :`${innerHeight} bottom`,
            end: isMobile ? `${innerHeight} 10%` : null,
            // onUpdate: ({progress}) => {
            //     cloud1.style.setProperty('--x', progress * -180+'px');
            // }
        }   
    })
    .to(
        textBlock.querySelectorAll('[style*="overflow"]>*'), 
        { yPercent:  isMobile ? 0 : 100, duration: isMobile ? 1 : 0.1, autoAlpha: 0 },
        
        )
    .to(
        textBlock.querySelectorAll('.button'), 
        {duration: isMobile ? 1 : 0.1, autoAlpha: 0, overwrite: true },
        '<'
        )
    .to(
        textBlock.querySelectorAll('.main-screen__text>*:first-child'), 
        { yPercent: isMobile ? 0 : 0, duration: isMobile ? 1 : 0.05},
        '<'
        )
    .to(cloud1, { x: isMobile ? -30 : -180, duration: 1 }, '<')
    .to(render, { scale: isMobile ? 1 : 1.1, duration: 1, y: 50, ease: 'linear' }, '<')
    tlScreen1.scrollTrigger.disable();
    window.addEventListener('preloaderEffectFinish', () => {
    });
    const interval = setInterval(() => {
        console.log(interval);
        if (window.preloaderFinished) {
            clearInterval(interval);
            tlScreen1.scrollTrigger.enable();
        }
    }, 500);
}


function wrap(elToWrap) {
    const div = document.createElement('div');
    div.append(elToWrap);
    return div;
}