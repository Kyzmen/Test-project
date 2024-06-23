import { isMobile } from "../helpers/helpers";

export default function splitToLinesAndFadeUp(selector, $scroller) {
    document.querySelectorAll(selector).forEach(text => {
        let mathM = text.innerHTML.match(/<\s*(\w+\b)(?:(?!<\s*\/\s*\1\b)[\s\S])*<\s*\/\s*\1\s*>|\S+/g);
        if (mathM === null) return;
        mathM = mathM.map(el => `<span style="display:inline-flex"><span>${el}</span></span>`);
        text.innerHTML = mathM.join(' ');
        gsap.set(text.children, { overflow: 'hidden' });
        gsap.set(text.querySelectorAll('span>span'), { overflow: 'initial', display: 'inline-block' });
        let tl = gsap
          .timeline({
            // paused: true,
            scrollTrigger: {
              scroller: $scroller && !isMobile() ? $scroller : null,
              trigger: text,
              once: true,
            },
          })
          .fromTo(
            text.querySelectorAll('span>span'),
            { yPercent: 100,  },
            { yPercent: 0,  stagger: 0.05, duration: 1, ease: 'power4.out' },
          )
          .add(() => {
            text.innerHTML = text.textContent;
          })
          ;

          // text.addEventListener('click',function(evt){
          //   tl.progress(0).play();
          // });
      });


}