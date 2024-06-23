import gsap from "gsap";
export default function innerPageFrontEffect() {
    const innerTemplate = document.querySelector('.inner-front');
    const bottomDecor = innerTemplate.querySelectorAll('.inner-front .inner-front__bottom-decor path'),
        breadcrumbs = innerTemplate.querySelectorAll('.breadcrumbs>*'),
        topDecor = innerTemplate.querySelectorAll('.inner-front__image-in-logo path'),
        title = innerTemplate.querySelector('.inner-front__title>div'),
        smallDecor = innerTemplate.querySelectorAll('.inner-front__small-bottom-decor path');

    const headerInner = document.querySelectorAll('.header>*:not(.header-logo)');
    const tl = gsap.timeline({
        paused: true,
        defaults: {
            clearProps: 'all',
            ease: 'power4.out',
            duration: 1.75,
        }
    })
        .fromTo(title, { yPercent: 104 }, { yPercent: 0 })
        .fromTo(bottomDecor, { yPercent: 104 }, { yPercent: 0, stagger: 0.05 }, '<')
        .fromTo(breadcrumbs, { yPercent: 104 }, { yPercent: 0, stagger: 0.05 }, '<')
        .fromTo(headerInner, { y: 201 }, { y: 0, stagger: -0.05 }, '<')
        .fromTo(smallDecor, { autoAlpha: 0, y: 104 }, { autoAlpha:1, y: 0, stagger: -0.1 }, '<')
        .fromTo(topDecor, 
            { 
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
                webkitClipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            }, 
            { 
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                webkitClipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                stagger: 0.05 
            }, 
            '<'
        )
        .fromTo(innerTemplate.nextElementSibling.children, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0 }, '<')
        .add(() => {
            tl.kill();
            window.dispatchEvent(new Event('screen1EffectFinish'))
        });
    // window.addEventListener('click',function(evt){
    //     tl.progress(0).play();
    // });
    window.addEventListener('preloaderOff',function(evt){
        tl.progress(0).play();
    });
}