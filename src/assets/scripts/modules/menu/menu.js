import gsap from "gsap";
export default function menuHandler() {
    const callButtons = document.querySelectorAll('[data-menu-call]');
    const closeButtons = document.querySelectorAll('[data-menu-close]');
    const menu = document.querySelector('.menu')
    callButtons.forEach((el) => {
        openMenu(el, menu);
    })
    closeButtons.forEach((el) => {
        closeMenu(el, menu);
    })
}

const morphs = [
    'M 0 100 V 50 Q 50 0 100 50 V 100 z',
    'M 0 100 V 0 Q 50 0 100 0 V 100 z',
    'M 0 0 V 100 Q 50 100 100 100 V 0 z',
    'M 0 0 V 50 Q 50 0 100 50 V 0 z',
    'M 0 0 V 0 Q 50 0 100 0 V 0 z',
];
const morphsReversed = [
    'M 0 0 Q 4 0 8 0 L 8 0 Q 4 0 0 0',
    'M 0 0 Q 4 4 8 0 L 8 0 Q 4 0 0 0',
    'M 0 8 Q 4 8 8 8 L 8 0 Q 4 0 0 0',
    'M 0 8 Q 4 8 8 8 L 8 8 Q 4 6 0 8',
    'M 0 8 Q 4 8 8 8 L 8 8 Q 4 8 0 8',
];
/**
 
M 0 100 V 50 Q 50 0 100 50 V 100 z"
M 0 100 V 0 Q 50 0 100 0 V 100 z"
M 0 0 V 100 Q 50 100 100 100 V 0 z"
M 0 0 V 50 Q 50 0 100 50 V 0 z"
M 0 0 V 0 Q 50 0 100 0 V 0 z"

 */

function openMenu(button, menu) {
    const menuLinks = menu.querySelectorAll('.menu__main [data-menu-links]>*');
    
    const tl = gsap.timeline({
        duration: 0.85,
        paused: true,
    }) 
        .add(enableCurtainFromBottom(), '<')
        .to(menu, { autoAlpha: 1, duration: 0.55 },'<35%')
        .fromTo(menuLinks, 
            { y: 50, autoAlpha: 0, }, 
            { y: 0, autoAlpha: 1, clearProps: 'all', duration: 1 }, 
            '<')
        .add(() => {
            window.lastScrollPosition = document.documentElement.scrollTop;
            document.body.classList.add('popup-opened');
            document.documentElement.classList.add('popup-opened');
            menu.classList.add('opened')
        })
    button.addEventListener('click',function(evt){
        window.dispatchEvent(new Event('menu-open'))
        tl.progress(0).play();
    });
}

function closeMenu(button, menu) {
    const menuLinks = menu.querySelectorAll('.menu__main [data-menu-links]>*');
    const isMobile = window.matchMedia('(max-width: 575px)').matches;
    const tl = gsap.timeline({
        duration: 0.45,
        paused: true
    })
    .add(() => {
        document.body.classList.remove('popup-opened');
        document.documentElement.classList.remove('popup-opened');
        isMobile && window.lastScrollPosition && window.scrollTo(0, window.lastScrollPosition)
        menu.classList.remove('opened');
    })
    .add(enableCurtainFromTop(), '<')
    .to(menu, { autoAlpha: 0, duration: 0.55 },'<35%')
    .fromTo(menuLinks, 
        { y: 0, autoAlpha: 1, }, 
        { y: 50, autoAlpha: 0, duration: 0.75 }, 
        '<-0.55')
    
    button.addEventListener('click',function(evt){
        tl.progress(0).play();
    });
}
function enableCurtainFromBottom() {
    const tl = gsap.timeline()
    .set('.menu-curtain path', {
        attr: { d: 'M 0 100 V 100 Q 50 100 100 100 V 100 z' },
        autoAlpha: 1
    })
    .to('.menu-curtain path', { 
        duration: 0.8,
        ease: 'power4.in',
        attr: { d: 'M 0 100 V 50 Q 50 0 100 50 V 100 z' }
    }, 0)
    .to('.menu-curtain path', { 
        duration: 0.3,
        ease: 'power2',
        attr: { d: 'M 0 100 V 0 Q 50 0 100 0 V 100 z' },
    })
    .set('.menu-curtain path', { 
        attr: { d: 'M 0 0 V 100 Q 50 100 100 100 V 0 z' }
    })
    .to('.menu-curtain path', { 
        duration: 0.3,
        ease: 'power2.in',
        attr: { d: 'M 0 0 V 50 Q 50 0 100 50 V 0 z' }
    })
    .to('.menu-curtain path', { 
        duration: 0.8,
        ease: 'power4',
        attr: { d: 'M 0 0 V 0 Q 50 0 100 0 V 0 z' }
    })
    .set('.menu-curtain path', { autoAlpha: 0 })
    // menu items translate animation

    // const durations = {
    //     1: 0.8,

    // }
    // morphs.forEach((d, index) => {
    //     if (index === 3 || index === 0) {
            
    //         tl.set('.menu-curtain path', { 
    //             attr:  {  d  },
    //             ease: 'none',
    //             duration: 0.35,
    //             clearProps: 'all'
            
    //         })
    //         return;
    //     }
    //     tl.to('.menu-curtain path', { 
    //         attr:  {  d  },
    //         ease: 'none',
    //         duration: 0.35,
    //         // delay: 0,
        
    //     })
    // })
    return tl;
}
function enableCurtainFromTop() {
    // const tl = gsap.timeline({
    //     // ease: 'power2.out',
    //     // duration: 2.5
    // });
    // morphsReversed.forEach((d, index) => {
        
    //     tl.to('.menu-curtain path', { 
    //         attr:  {  d  },
    //         ease: 'none',
    //         duration: 0.35,
    //         clearProps: 'all'
        
    //     })
    // })

    const tl = gsap.timeline()
        .set('.menu-curtain path', {
            attr: { d: 'M 0 0 V 0 Q 50 0 100 0 V 0 z' },
            autoAlpha: 1
        })
        .to('.menu-curtain path', { 
            duration: 0.8,
            ease: 'power4.in',
            attr: { d: 'M 0 0 V 50 Q 50 100 100 50 V 0 z' }
        }, 0)
        .to('.menu-curtain path', { 
            duration: 0.3,
            ease: 'power2',
            attr: { d: 'M 0 0 V 100 Q 50 100 100 100 V 0 z' },
        })
        // now reveal
        .set('.menu-curtain path', { 
            attr: { d: 'M 0 100 V 0 Q 50 0 100 0 V 100 z' }
        })
        .to('.menu-curtain path', { 
            duration: 0.3,
            ease: 'power2.in',
            attr: { d: 'M 0 100 V 50 Q 50 100 100 50 V 100 z' }
        })
        .to('.menu-curtain path', { 
            duration: 0.8,
            ease: 'power4',
            attr: { d: 'M 0 100 V 100 Q 50 100 100 100 V 100 z' }
        })
        .set('.menu-curtain path', { autoAlpha: 0 })
        // title elements
    return tl;
}
