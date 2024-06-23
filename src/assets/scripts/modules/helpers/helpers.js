export const eases = {
  ex: 'expo.inOut',
  exI: 'expo.in',
  exO: 'expo.out',
  p4: 'power4.inOut',
  p4I: 'power4.in',
  p4O: 'power4.out',
  p2: 'power2.inOut',
  p2I: 'power2.in',
  p2O: 'power2.out',
  circ: 'circ.inOut',
  circO: 'circ.out',
  circI: 'circ.in',
};

export const langDetect = () => {
  if (window.location.pathname.match(/\/ru\//)) {
    return 'ru';
  } if (window.location.pathname.match(/\/en\//)) {
    return 'en';
  }
  return 'uk';
};

export const addIntersectionOnceWithCallback = (el, cb = () => {}) => {
  const image = el;
  const target = image;
  const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
          if (entry.isIntersecting) {
              const lazyImage = entry.target;
              cb();
              observer.unobserve(target);
          }
        });
      }, {
          rootMargin: '0px',
          threshold: 0.1,
        });
      observer.observe(target);
}

export function loader(callback, config, nameProject) {
  const arrTimes = [];
  let i = 0; // start
  const timesToTest = 3;
  const tThreshold = 400; // ms
  const numImage = 1;
  const testImage = `/wp-content/themes/smartoagency/assets/images/jpg/andriyivsky-city-space.jpg`; // small image in your server
  const dummyImage = new Image();
  let isConnectedFast = false;

  testLatency(avg => {
    isConnectedFast = {
      fastSpeed: (avg <= tThreshold),
      middleTime: avg,
      checkImage: numImage,
    };
    /** output */
    callback(isConnectedFast);
    return avg;
  });

  /** test and average time took to download image from server, called recursively timesToTest times */
function testLatency(cb) {
    const tStart = new Date().getTime();
    if (i < timesToTest - 1) {
      dummyImage.src = `${testImage}?t=${tStart}`;
      dummyImage.onload = function () {
        const tEnd = new Date().getTime();
        const tTimeTook = tEnd - tStart;
        arrTimes[i] = tTimeTook;
        testLatency(cb);
        i++;
      };

      dummyImage.onerror = function () {
        const tEnd = new Date().getTime();
        const tTimeTook = tEnd - tStart;
        arrTimes[i] = tTimeTook;
        testLatency(cb);
        i++;
      };
    } else {
      /** calculate average of array items then callback */
      const sum = arrTimes.reduce((a, b) => a + b);
      const avg = sum / arrTimes.length;
      cb(avg);
    }
  }
}

export const wrap = function (toWrap, wrapper, tag = 'div') {
  wrapper = wrapper || document.createElement(tag);
  toWrap.parentNode.appendChild(wrapper);
  wrapper.appendChild(toWrap);
  return wrapper;
};




export const fromPathToArray = function(path) {
  const PATH_COMMANDS = {
    M: ["x", "y"],
    m: ["dx", "dy"],
    H: ["x"],
    h: ["dx"],
    V: ["y"],
    v: ["dy"],
    L: ["x", "y"],
    l: ["dx", "dy"],
    Z: [],
    C: ["x1", "y1", "x2", "y2", "x", "y"],
    c: ["dx1", "dy1", "dx2", "dy2", "dx", "dy"],
    S: ["x2", "y2", "x", "y"],
    s: ["dx2", "dy2", "dx", "dy"],
    Q: ["x1", "y1", "x", "y"],
    q: ["dx1", "dy1", "dx", "dy"],
    T: ["x", "y"],
    t: ["dx", "dy"],
    A: ["rx", "ry", "rotation", "large-arc", "sweep", "x", "y"],
    a: ["rx", "ry", "rotation", "large-arc", "sweep", "dx", "dy"]
  };
  const items = path.replace(/[\n\r]/g, '').
                replace(/-/g, ' -').
                replace(/(\d*\.)(\d+)(?=\.)/g, '$1$2 ').
                trim().
                split(/\s*,|\s+/);
  const segments = [];
  let currentCommand = '';
  let currentElement = {};
  while (items.length > 0){
    let it = items.shift();
    if (PATH_COMMANDS.hasOwnProperty(it)){
      currentCommand = it;
    }
    else{
      items.unshift(it);
    }
    currentElement = {type: currentCommand};
    PATH_COMMANDS[currentCommand].forEach((prop) => {
      it = items.shift();  // TODO sanity check
      currentElement[prop] = it;
    });
    if (currentCommand === 'M'){
      currentCommand = 'L';
    }
    else if (currentCommand === 'm'){
      currentCommand = 'l';
    }
    segments.push(currentElement);
  }
  return segments
}

export const isMobile = () => window.matchMedia('(max-width: 575px)').matches;
export const isFullHd = () => window.matchMedia('(min-width: 1920px)').matches;
export const lazyImages = () => {
  const options = {
    rootMargin: '0px',
    threshold: 0.01,
  };
  const lazyImages = document.querySelectorAll('img[data-src]');
  
  lazyImages.forEach((imageArgs) => {
    const image = imageArgs;
    // image.style.opacity = 0;
    // image.style.transition = ' .1s ease-out';
    image.addEventListener('load', () => {
      // image.style.opacity = 1;
      image.style.opacity = 1;
      setTimeout(() => {
        image.removeAttribute('data-src');
      }, 1000);
    });
    const target = image;
    const observer = new IntersectionObserver((entries) => {
      /* Content excerpted, show below */
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
            lazyImage.src = lazyImage.dataset.src;
          // image.style.transition = '';
          observer.unobserve(target);
        }
      });
    }, options);
    observer.observe(target);
  });
}
export const lazyPosters = () => {
  const options = {
    rootMargin: '0px',
    threshold: 0.01,
  };
  const lazyImages = document.querySelectorAll('[data-poster]');
  
  lazyImages.forEach((imageArgs) => {
    const image = imageArgs;
    const target = image;
    const observer = new IntersectionObserver((entries) => {
      /* Content excerpted, show below */
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const lazyImage = entry.target;
          lazyImage.setAttribute('poster', lazyImage.dataset.poster);
          image.style.transition = '';
          observer.unobserve(target);
        }
      });
    }, options);
    observer.observe(target);
  });
}


export const debounce = (func, timeout = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

export const transitionBetweenSectionSceneLength = () => {
  const isMobile = window.matchMedia('(max-width: 575px)').matches;
  if (isMobile) {
    return {
      start: `${innerHeight / -2} center`,
      end: `${innerHeight / 2} center`
    }
  }
  return {
    start: `${innerHeight / -15} center`,
    end: `${innerHeight / 15} center`,
  }
}

export function handleHeader(scroller) {
  function throttle(func, ms) {

    let isThrottled = false,
      savedArgs,
      savedThis;
  
    function wrapper() {
  
      if (isThrottled) { // (2)
        savedArgs = arguments;
        savedThis = this;
        return;
      }
  
      func.apply(this, arguments); // (1)
  
      isThrottled = true;
  
      setTimeout(function() {
        isThrottled = false; // (3)
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }
  
    return wrapper;
  }

  function onScroll(scroll) {
    const tempState = prevScrollPosition > scroll.y ? 'open' : 'close';
    prevScrollPosition = scroll.y;
    
    if (scroll.y > 100) {
      changeState['untransparent']();
    } else {
      changeState['transparent']();
    }
    if (scroll.y < 150) return;
    header.state = tempState;
    if (scroll.y > 200) changeState[tempState]();
  }
  const onScrollThrottle = throttle(onScroll, 100);
  const header = document.querySelector('.header');
  header.state = 'open';

  window.addEventListener('scroll-top-reach', () => {
    setTimeout(() => {
      changeState['open']();
    }, 1000);
    console.log('scrollTopReact');
  })
  let prevScrollPosition = 0;
  scroller.on('scroll', ({ scroll }) => {
    onScrollThrottle(scroll);
  });


  const changeState = {
    open: () => {
      header.classList.remove('hide')
      // gsap.to(header, { yPercent : 0 });
    },
    close: () => {
      header.classList.add('hide')
      // gsap.to(header, { yPercent : -100 });
    },
    transparent: () => {
      header.classList.add('transparent');
      header.classList.remove('hide');
    },
    untransparent: () => {
      header.classList.remove('transparent');
    }
  }
}