import innerPageFrontEffect from "../modules/inner-pages/inner-page-front-effect";
import locoScroll from '../modules/smooth-scrolls/locoScroll';
import { handleHeader } from "../modules/helpers/helpers";

innerPageFrontEffect();
window.addEventListener('load',function(evt){
      const scroller = locoScroll('.scroller-container');
    scroller.update();
    handleHeader(scroller);
    window.scroller = scroller;
});


document.querySelectorAll('.web-item').forEach(item => {
    const button = item.querySelector('[data-circle-with-hover]');
    const frame = item.querySelector('iframe');
    const playButtonPath = item.querySelector('[data-circle-with-hover] path');
    const morphs = {
        default: playButtonPath.getAttribute('d'),
        custom: 'M 59 60 L 38 60 C 38 60 38 60 38 60 L 38 40 C 38 40 59 40 59 40 L 59 60 C 59 60 59 60 59 60 Z',
    }
    button.addEventListener('click', () => {
        const isHaveClass = item.classList.toggle('is-playing');
        if (isHaveClass) {
            frame.src = frame.dataset.src;
        } else {
            frame.removeAttribute('src');
        }
        gsap.to(playButtonPath, {
            duration: 0.5,
            ease: 'linear',
            attr: {
                d: isHaveClass ? morphs.custom : morphs.default,
            } 
        })
    })
})