import innerPageFrontEffect from "../modules/inner-pages/inner-page-front-effect";
import locoScroll from '../modules/smooth-scrolls/locoScroll';
import { handleHeader } from "../modules/helpers/helpers";
import Swiper, { Navigation } from 'swiper';
import buildProgressCardRenderer from './build-progress/build-progress-card-renderer';
import buildProgressPopupUpdate from './build-progress/build-progress-popup-update';



const isMobile = window.matchMedia('(max-width: 575px)').matches;
var swiper = new Swiper(".swiper", {
    modules: [ Navigation],
    slidesPerView: isMobile ? 1.75 : "auto",
    spaceBetween: isMobile ? 0 : 100,
    centeredSlides: isMobile,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
    navigation: {
        nextEl: document.querySelector('.status-wrap [data-next]'),
        prevEl: document.querySelector('.status-wrap [data-prev]'),
    },
    roundLengths: true,
  });

innerPageFrontEffect();
window.addEventListener('load',function(evt){
      const scroller = locoScroll('.scroller-container');
    scroller.update();
    handleHeader(scroller);
    window.scroller = scroller;
    window.addEventListener('dom-update', () => {
      window.scroller.update();
    });

    buildProgressCardRenderer();
    // scroller.destroy();
    // gsap.set('.scroller-container', { position: 'static' })
});



function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
  
  function describeArc(x, y, radius, startAngle, endAngle){
  
      var start = polarToCartesian(x, y, radius, endAngle);
      var end = polarToCartesian(x, y, radius, startAngle);
  
      var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
  
      var d = [
          "M", start.x, start.y, 
          "A", radius, radius, 0, arcSweep, 0, end.x, end.y,
          "L", x,y,
          "L", start.x, start.y
      ].join(" ");
  
      return d;       
  }

document.querySelectorAll('[data-build-arc]').forEach(path => {
    const { buildArc } = path.dataset;
    const degreesToPercentRatio = buildArc * 360 / 100;
    path.setAttribute('d', describeArc(125,125,125,0, degreesToPercentRatio))
    console.log(buildArc);
})



/**Попап для кругляшек про статус дома */
document.querySelectorAll('[data-build-popup-status]').forEach(el => {
  const close = el.querySelector('[class*="close"]');
  close.addEventListener('click', () => {
    gsap.to(el, { autoAlpha: 0 });
    window.dispatchEvent(new Event('popup-close'));
  });
})

/**Изменение инфы при клике на стрелки внутри попапа про статус дома */
const popupProgressPrevArrow = document.querySelector('[data-status-popup-prev]');
const popupProgressNextArrow = document.querySelector('[data-status-popup-next]');


popupProgressNextArrow && popupProgressNextArrow.addEventListener('click', () => {
  const popup = document.querySelector('[data-build-popup-status]');
  let currentId = +popup.dataset.currentId || 0;
  const statuses = document.querySelectorAll('[data-single-build-status]');
  currentId = (currentId === (statuses.length - 1)) ? 0 : currentId + 1;
  console.log(currentId);
  statuses[currentId].dispatchEvent(new Event('click'))
})
popupProgressPrevArrow && popupProgressPrevArrow.addEventListener('click', () => {
  const popup = document.querySelector('[data-build-popup-status]');
  let currentId = +popup.dataset.currentId || 0;
  const statuses = document.querySelectorAll('[data-single-build-status]');
  // currentId = ((currentId + 1) === (statuses.length - 1)) ? 0 : currentId + 1;
  currentId = (currentId === 0) ? statuses.length - 1 : currentId - 1;
  console.log(currentId);
  statuses[currentId].dispatchEvent(new Event('click'))
})

/**Кругляшки про статус дома */
document.querySelectorAll('[data-single-build-status]').forEach((el, index) => {
  const { id } = el.dataset;
  el.addEventListener('click', async () => {
    getProgressPopupData(id, index)
  })
})

async function getProgressPopupData(id, index) {

  const popup = document.querySelector('[data-build-popup-status]');
  const popupTextBlock = popup.querySelector('[class*="text"]')
  const popupTitleBlock = popup.querySelector('[class*="title"]')
  const popupProgressBlock = popup.querySelector('.build-status-popup__progress')
  const fetchBody = new FormData();
  fetchBody.append('action', 'buildInfo');
  // let innerInfo = await fetch(`./static/build-popup-info.php?id=${id}`);
  const url  = window.location.href.match(/localhost/) 
    ? `./static/build-popup-info.php?id=${id}` 
    : '/wp-admin/admin-ajax.php';
  let innerInfo = await fetch(url, {
    method: window.location.href.match(/localhost/) ? 'GET' : 'POST',
    body: window.location.href.match(/localhost/) ? undefined : fetchBody,
  });
  innerInfo = await innerInfo.json();

  if (!window.location.href.match(/localhost/)) {
    innerInfo = innerInfo[+id];
  }
  console.log(innerInfo);
  const {title, text, items, innerTitle} = innerInfo;
  popupTextBlock.textContent = text;
  popupTitleBlock.textContent = title;
  popupProgressBlock.innerHTML = '';
  items.forEach(item => {
    popupProgressBlock.innerHTML += getInnerPopupProgressItem(item);
  })
  popupProgressBlock.innerHTML += getAfterBarsTitle(innerTitle);
  popup.dataset.currentId = index;
  gsap.to(popup, { autoAlpha: 1 });
  window.dispatchEvent(new Event('popup-open'));
}

 
function getAfterBarsTitle(title) {
  return `<div class="build-status-popup__progress-bottom-title">${title}</div>`;
}
function getInnerPopupProgressItem({ value, title, text }) {
  return `
    <div class="build-single-progress-item" data-text="${text}" style="--progress: ${value}%">
      <div class="build-single-progress-item__title">${title}</div>
      <div class="build-single-progress-item__bar">
        <div class="build-single-progress-item__bar-title">${value}%</div>
        <div class="build-single-progress-item__bar-value"> </div>
      </div>
    </div>
  `;
}




const swiper1 = new Swiper(".build-swiper", {
    modules: [ Navigation],
    slidesPerView: 1,
    // spaceBetween: 100,
    // pagination: {
    //   el: ".swiper-pagination",
    //   clickable: true,
    // },
    navigation: {
      prevEl: document.querySelector('[data-progress-popup-prev]'),
      nextEl: document.querySelector('[data-progress-popup-next]'),
    },
    // roundLengths: true,
  });

/**Попап карточек строительства */
document.querySelectorAll('[data-build-popup-progress]').forEach(el => {
  const close = el.querySelector('[class*="close"]');
  close.addEventListener('click', () => {
    gsap.to(el, { autoAlpha: 0 });
    window.dispatchEvent(new Event('popup-close'));
  })
})


document.querySelector('.build-progress-conteiner').addEventListener('click', ({ target }) => {
  if (target.closest('.build-card') === null) return;
  

  console.log(target.closest('.build-card').dataset);
  buildProgressPopupUpdate(
    target.closest('.build-card').dataset.id, 
    document.querySelector('[data-build-popup-progress]'),
    () => {
      swiper1.update();
      gsap.to('[data-build-popup-progress]', { autoAlpha: 1 });
    },
    target.closest('.build-card').dataset.date, 
  );
  window.dispatchEvent(new Event('popup-open'));
})


document.querySelectorAll('[data-build-popup-progress-inner-text]').forEach(button => {
  
  const innerPopup = button.parentElement;
  const textEl = button.querySelector('span');
  let state = innerPopup.dataset.state;
  button.addEventListener('click', () => {
    console.log(state);
    state = !state;
    gsap.to(innerPopup, { xPercent: state ? 0 : -100, duration: 1.75, ease: 'power4.out' });
    textEl.textContent = state ? innerPopup.dataset.openedText : innerPopup.dataset.closedText;
    innerPopup.dataset.state = state;
  })
})