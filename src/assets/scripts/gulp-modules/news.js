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


window.addEventListener('update-dom', () => {
  if (window.scroller = scroller) {
    window.scroller.update();
  }
})

const newsAction = new FormData();
newsAction.append('action', 'news');

const URL = window.location.href.match(/localhost/) ? 'https://central-park-wp.smarto.com.ua/wp-admin/admin-ajax.php' : '/wp-admin/admin-ajax.php';
fetch(URL, {
  method: 'POST',
  body: newsAction
})
  .then(el => el.json())
  .then(({data}) => {
    renderNewsByPortions(data, document.querySelector('.scroller-container .news'));
  })


function renderNewsByPortions(data, $container) {
  $container.innerHTML = '';
  const initialPortionForRender = 2;
  let portionForRender = 2;
  let startIndex = 0;
  let currentRenderedIndex = 0;
  portionForRender = initialPortionForRender;
  for (let i = 0; i < portionForRender; i++) {
    const day = data[i];
    if (day === undefined) break;
    currentRenderedIndex = i;
    $container.insertAdjacentHTML(
      'beforeend',
      day,
    );
  }
  startIndex = portionForRender;
  portionForRender += initialPortionForRender;
  window.dispatchEvent(new Event('update-dom'));
  $container.lastElementChild && addIntersectionOnceWithCallback($container.lastElementChild, () => {
    if (currentRenderedIndex >= data.length) return;
    additionalRender();
    window.dispatchEvent(new Event('update-dom'));
  });

  

  function additionalRender() {
    for (let i = startIndex; i < portionForRender; i++) {
      // console.log(i, data[i]);
      const day = data[i];
      if (day === undefined) break;
      currentRenderedIndex = i;
      $container.insertAdjacentHTML(
        'beforeend',
        day,
      );
    }
    startIndex = portionForRender;
    portionForRender += initialPortionForRender;

    // console.log(currentRenderedIndex);
    if (currentRenderedIndex >= data.length || portionForRender >= data.length) return;
    $container.lastElementChild && addIntersectionOnceWithCallback($container.lastElementChild, () => {
      if (currentRenderedIndex >= data.length || portionForRender >= data.length) return;
      additionalRender();
      window.dispatchEvent(new Event('update-dom'));
    });
  }
  function addIntersectionOnceWithCallback(el, cb = () => {}) {
    const image = el;
    const target = image;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          cb();
          observer.unobserve(target);
        }
      });
    }, {
      rootMargin: '0px',
      threshold: 0.1,
    });
    // console.log(target);
    observer.observe(target);
  }

}