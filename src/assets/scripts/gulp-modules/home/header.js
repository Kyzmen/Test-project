import gsap from "gsap/all";
import { isMobile } from "../../modules/helpers/helpers";

export default function headerHandle() {
    const button = document.querySelector('[data-mob-toggle]');
    const links = document.querySelectorAll('.nav__link');
    const linksHeight = links[0].getBoundingClientRect().height * links.length + 20;
    // console.log();
    button.addEventListener('click', () => {
        const isHidden = getComputedStyle(document.querySelector('.nav__link')).display;
        
        isHidden === 'block' ? closePoints(linksHeight).play() : openPoints(linksHeight).play();
    })
    if (isMobile()) button.dispatchEvent(new Event('click')); 
}

function openPoints(linksHeight) {
    const duration = 0.75;
    return gsap.timeline({ paused: true })
    .to('.nav__logo', { y: linksHeight * -1, duration, ease: 'power3.out' }, '<')
    .set('.nav__link', { display: '' })
        .to('.nav__link', { scaleY: 1, duration, stagger: 0.05, ease: 'power3.out' }, '<')
        .set('.nav__logo', { y: 0 }, '<')
}
function closePoints(linksHeight) {
    const duration = 0.5;
    return gsap.timeline({ paused: true })
        .to('.nav__link', { scaleY: 0, duration, stagger: 0.05, ease: 'power3.in' })
        .to('.nav__logo', { y: linksHeight, duration, ease: 'power3.in' }, '<+0.25')
        .set('.nav__link', { display: 'none' })
        .set('.nav__logo', { y: 0 }, '<')
}