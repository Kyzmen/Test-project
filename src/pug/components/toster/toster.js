import gsap from 'gsap';
import BezierEasing from 'bezier-easing';

export default class MyToster {
  constructor(setting) {
    this.$wrap = setting.$wrap;
    this.$item = setting.$item;
    this.ease_0 = BezierEasing(0.34, 0.98, 0.43, 0.95);

    this.$body = document.querySelector('body');

    this.init();
  }

  /*  */
  createItem({ type, title, text }) {
    return `
      <div class="toast" data-toast-item="" data-toast-status="${type}">
        <div class="toast-logo-block">
          <div class="toast__logo">
            <svg class="icon--logo" role="presentation">
              <use xlink:href="#icon-logo"></use>
            </svg>
          </div>
        </div>
        <div class="toast-content-block">
          <h5 class="toast__title">${title}</h5>
          <p class="toast__text">${text}</p>
        </div>
        <button class="toast__colose-btn" data-toast-colose-btn="" type="button">
          <svg class="icon--close" role="presentation">
            <use xlink:href="#icon-close"></use>
          </svg>
        </button>
      </div>
    `;
  }

  removeItem(item) {
    gsap.fromTo(
      item,
      0.25,
      { xPercent: 0, ease: this.ease_0 },
      {
        xPercent: 100,
        onComplete: () => {
          item.remove();
        },
      },
    );
  }

  addToast(settingObj) {
    const markup = this.createItem(settingObj);
    this.$wrap.insertAdjacentHTML('beforeend', markup);
    /*  */
    const items = this.$wrap.querySelectorAll('[data-toast-item]');
    const item = items[items.length - 1];
    /*  */
    gsap.fromTo(
      item,
      0.75,
      { xPercent: 100, skewX: -10 },
      { xPercent: 0, skewX: 0, ease: this.ease_0 },
    );

    setTimeout(() => {
      this.removeItem(item);
    }, 3000);
  }

  listeners() {
    const self = this;
    this.$wrap.addEventListener('click', ({ target }) => {
      if (target.closest('[data-toast-colose-btn]') !== null) {
        const item = target.closest('[data-toast-item]');
        self.removeItem(item);
      }
    });
  }

  init() {
    this.listeners();
  }
}
