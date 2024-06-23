import gsap from "gsap";

export default function clipPathEntry(selector, scroller, effectConfig = {}) {
    const startClip = 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)';
    const endClip = 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%';
    document.querySelectorAll(selector).forEach(text => {
        let tl = gsap
        .timeline({
            // paused: true,
            scrollTrigger: {
                trigger: text,
                scroller: scroller ? scroller : null,
                once: true,
            },
        })
        .fromTo(
            text,
            { clipPath: startClip, webkitClipPath: startClip },
            { 
                clipPath: endClip, 
                webkitClipPath: endClip, 
                duration: 1.95, 
                ease: 'power4.out', 
                clearProps: 'transform',
                ...effectConfig
            },
          );
      });
}