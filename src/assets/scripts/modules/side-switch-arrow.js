import Hammer from "hammerjs";
export default function sideSwitchArrow(opts, arrowArgs, conArgs) {
  const isMobile = window.matchMedia('(max-width:1024px)').matches;
  const arrow = arrowArgs;
  const container = conArgs;
  const mediumCordValue = document.documentElement.clientWidth / 2;
  document.body.append(arrow);
  container.style.cursor = 'none';
  arrow.style.cursor = 'none';
  arrow.style.zIndex = 10;
  arrow.__proto__.hide = function some() {
    this.style.opacity = '0';
    this.style.pointerEvents = 'none';
  };
  arrow.__proto__.show = function some() {
    this.style.opacity = '1';
    // this.style.pointerEvents = 'auto';
  };
  arrow.dataset.side = 'leftSide';
  arrow.hide();

  container.addEventListener('mousemove', desktopNavButtonHandler);
  container.addEventListener('mouseenter', () => {
    arrow.show();
  });
  container.addEventListener('mouseleave', () => {
    arrow.hide();
  });
  if (document.documentElement.clientWidth < 1025) {
    window.removeEventListener('mousemove', desktopNavButtonHandler);
    arrow.remove();
  }

  /** Записывает координаты обьекта, на котором нужно скрыть стрелку переключения слайдера */
  /** ms ---> main-screen */


  function desktopNavButtonHandler(evt) {
    // arrow.style.position = 'fixed';
    // arrow.style.left = `${evt.clientX - 18}px`;
    // arrow.style.top = `${evt.clientY - 18}px`;
    arrow.style.transform = `translate(${evt.clientX - 18}px, ${evt.clientY - 18}px)`;

    getCursorSide(evt.clientX);
    handleArrowVisibility(evt);
  }


  function handleArrowVisibility() {
  }

  function getCursorSide(x) {
    if (x < (mediumCordValue)) {
      arrow.classList.add('left-side');
      arrow.dataset.side = 'leftSide';
      // switchGallerySlide('leftSide');
    } else {
      arrow.classList.remove('left-side');
      arrow.dataset.side = 'rightSide';
      // switchGallerySlide('rightSide')
    }
  }
  container.addEventListener('click', () => {
    if (isMobile && !opts.notOnMobile) return;
    switchGallerySlide(arrow.dataset.side);
  });
  // if (document.documentElement.clientWidth < 576) {
  //   container.removeEventListener('click', clickToChange);
  // }
  if (isMobile) {
    const hammer = new Hammer(container);
    hammer.on('swipeleft', () => {
      switchGallerySlide('leftSide')

    })
    hammer.on('swiperight', () => {
      switchGallerySlide('rightSide')
    })
  }

  const navigate = {
    leftSide: () => {
      opts.onPrev();
    },
    rightSide: () => {
      opts.onNext();
    },
  };

  function switchGallerySlide(side) {
    navigate[side]();
    return navigate.side;
  }


  // eslint-disable-next-line no-unused-vars
}
