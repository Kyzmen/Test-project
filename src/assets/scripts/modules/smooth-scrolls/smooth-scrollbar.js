import SmoothScrollbar, { ScrollbarPlugin } from 'smooth-scrollbar';
import { gsap, ScrollTrigger } from 'gsap/all';
export default function smoothScrollBar() {
    /**SMOOTH SCROLL */

  class DisableScrollPlugin extends ScrollbarPlugin {
    static pluginName = 'disableScroll';

    static defaultOptions = {
      direction: null,
    };
    onRender(r) {
      // console.log(r);
    }
    onUpdate() {
      // console.log('scrollbar updated');

      // this._update();
    }
    transformDelta(delta) {
      if (this.options.direction) {
        delta[this.options.direction] = 0;
      }

      return { x: 0, y: delta.y};
    }
  }

  SmoothScrollbar.use(DisableScrollPlugin);
  let scrollBar = SmoothScrollbar.init(document.querySelector('.scroller-container'), {
    overflowScroll: false,
  });
  scrollBar.track.xAxis.element.remove()

  if (!window.matchMedia('(max-width: 575px)').matches) {
    gsap.set('.scroller-container', { height: '100vh' })
    ScrollTrigger.scrollerProxy(".scroller-container", {
      scrollTop(value) {
        if (arguments.length) {
          scrollBar.scrollTop = value;
        }
        return scrollBar.scrollTop;
      }
    });
    const scroller = document.querySelector('.scroller-container');
    scrollBar.addListener(ScrollTrigger.update);
    
    ScrollTrigger.defaults({ scroller: scroller });
  }


  scrollBar.addListener(evt => {
    if (evt.offset.y > 1000) return;
    const { y } = evt.offset;
    const sidePanel = document.querySelector('.sidepanel');
    const header = document.querySelector('.header');
    // console.log(y);

    if (y > 200) {
      header.classList.add('not-on-top');
    } else {
      header.classList.remove('not-on-top');
    }
  });
  if (window.matchMedia('(max-width:575px)').matches) {
    scrollBar.destroy();
    gsap.set('.scroller-container', { height: 'auto' });
    scrollBar = document.body;
    window.addEventListener('scroll',function(evt){
      const header = document.querySelector('.header');
      if (this.scrollY > 200) {
        header.classList.add('not-on-top');
      } else {
        header.classList.remove('not-on-top');
      }
    });
  }
  document.querySelectorAll('.pageup').forEach(el => {
    el.addEventListener('click', () => {
      if (scrollBar !== undefined) {
        // console.log(scrollBar);
        scrollBar.scrollTo(0, 0, 1510);
      } else {
        window.scrollTo(0, 0);
      }
    });
  });
  document.querySelectorAll('.pagedown').forEach(el => {
    el.addEventListener('click', () => {
      if (scrollBar !== undefined) {
        // console.log(scrollBar);
        scrollBar.scrollIntoView(document.querySelector('[data-anchor="about"]'));
      } else {
        window.scrollTo(0, 0);
      }
    });
  });
  /**SMOOTH SCROLL END*/
}