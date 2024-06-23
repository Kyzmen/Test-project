import gsap from 'gsap';
import { loader } from '../modules/helpers/helpers';

export default function fake3d(containerArg, path = '/wp-content/themes/bogun/assets/images/home/screen2-sequence/', frames = 50, reverse) {
    // if (window.matchMedia('(max-width: 575px)').matches) return;
    const containerToAdd = document.createElement('img');
    containerToAdd.classList.add('js-transform-img');
    containerToAdd.style.cssText = `
        width: 100%;
        height: 100%;
        position: absolute;
        left: 0;
        top: 0;
        object-fit: cover;
        object-position: bottom;
        will-change: contents;
        z-index: -1;
    `;
    const container = containerArg;
    container.style.overflow = 'hidden';
    container.append(containerToAdd);

    // container.querySelector('.container').style.transform = 'translateZ(5px)';
    // document.documentElement.clientWidth > 950 ? container.querySelector('.container').style.height = '100%' : null;
    const imagesCount = frames;
    const array = [];
    const IMG_PATH = path;

    let loadedCounter = 0;
    /**Флаг блокировки при играющей анимации */
    let isAnimating = false;
    window.currentDisplayedImage = 0;
    let currentDisplayedImage = 0;
    // for (let index = 1; index < imagesCount; index++) {
    //     const element = imagesCount[index];
    //     fetch(`${IMG_PATH}${index}.jpg`)
    //         .then(el => el.blob())
    //         .then(el => {
    //             array[index] = URL.createObjectURL(el);
    //             loadedCounter += 1;
    //             // loadText.innerHTML = 'Loading ' + (loadedCounter * 100  / (imagesCount - 1)).toFixed(0);
    //             if ((loadedCounter * 100  / (imagesCount - 1)).toFixed(0) == 100) {
    //                 // loadText.innerHTML = 'Start move';
    //                 // console.log('loaded');
    //                 container.querySelector(':first-child').style.opacity = 0;
    //                 container.style.background = 'none';
    //                 gsap.set(containerToAdd, { attr: { src: array[2] } });
    //             };
    //         })
    // }

    fetch(path)
        .then(el => el.json())
        .then(el => {
            el.forEach(img => array.push(img));
            container.querySelector(':first-child').style.opacity = 0;
            container.style.background = 'none';
            gsap.set(containerToAdd, { attr: { src: array[2] } });
        })
    container.addEventListener('mouseenter', (e) => {
        return;
        if (loadedCounter < imagesCount -1) return;
        window.requestAnimationFrame(() => { 
            const cords = getAmplitudeOfMoving();
            if (e.clientX < cords.start || e.clientX > cords.end) return;
            const positionInPercent = e.type === 'touchmove' ? (e.targetTouches[0].clientX  * imagesCount / document.documentElement.clientWidth).toFixed()
            : ((e.clientX - cords.start)   * imagesCount / (document.documentElement.clientWidth * cords.scale) ).toFixed();
            changeImage(positionInPercent, true); 
        
        
        });
    });
    container.addEventListener('mousemove', (e) => {
        // console.log(isAnimating);
        return;
        // if (isAnimating) return;
        if (loadedCounter < imagesCount -1) return;
        const posInPercent = Math.floor(e.clientX * imagesCount / document.documentElement.clientWidth);
        // console.log('fff');
        window.requestAnimationFrame(() => { 
        const cords = getAmplitudeOfMoving();
        if (e.clientX < cords.start || e.clientX > cords.end) return;
        const positionInPercent = e.type === 'touchmove' ? (e.targetTouches[0].clientX  * imagesCount / document.documentElement.clientWidth).toFixed()
        : ((e.clientX - cords.start)   * imagesCount / (document.documentElement.clientWidth * cords.scale) ).toFixed();
        changeImage(positionInPercent) 
        
        
        });
    });
    container.addEventListener('touchmove', (e) => {
        return;
        e.preventDefault();
        if (loadedCounter < imagesCount -1) return;
        const posInPercent = Math.floor(e.targetTouches[0].clientX * imagesCount / document.documentElement.clientWidth);
        window.requestAnimationFrame(() => { changeImage(posInPercent) });
    });
    gsap.set(containerToAdd.parentElement, {webkitPerspective:100, /*webkitTransformStyle:"preserve-3d"*/})
    // gsap.set(containerToAdd, {scale: 1.2, /*webkitTransformStyle:"preserve-3d"*/})
    function changeImage(posInPercent, mouseenter = false) {
        if (isAnimating) return;
        if (mouseenter) {
            /**Переход от прошлой точки до текущей при заходе в контейнер */
            isAnimating = true;
            if (+currentDisplayedImage > +posInPercent) {
                const tlBig = gsap.timeline({ immediateRender: true });
                tlBig.pause();
                for (let k = +currentDisplayedImage; k >= +posInPercent; k--) {
                    tlBig.set(containerToAdd, { attr: { src: array[k] }}, '<+0.02');
                }
                tlBig.add(() => {
                    isAnimating = false;
                    currentDisplayedImage = posInPercent;
                })
                tlBig
                    // .to(containerToAdd, { x: posInPercent/-100, duration: 0.5 })
                    .play();
            } else if (+currentDisplayedImage < +posInPercent) {
                const tlBig =  gsap.timeline({ immediateRender: true });
                tlBig.pause();
                for (let k = +currentDisplayedImage; k <= +posInPercent; k++) {
                    tlBig.set(containerToAdd, { attr: { src: array[k] }}, '<+0.02');
                }
                tlBig.add(() => {
                    isAnimating = false;
                    currentDisplayedImage = posInPercent;
                })
                tlBig
                    // .to(containerToAdd, { x: posInPercent/-100, duration: 0.5 })
                    .play();
                
            }
            return;
        }
    if (currentDisplayedImage !== posInPercent && array[posInPercent] !== undefined && isAnimating === false) {
        containerToAdd.src = array[posInPercent];
        // gsap.timeline()
        // .set(containerToAdd, { attr: { src: array[posInPercent] } })
        // .to(containerToAdd, { x: posInPercent/-100, duration: 0.5 });
            currentDisplayedImage = posInPercent;
        }
    }
    function getAmplitudeOfMoving() {
            const width = document.documentElement.clientWidth;
            const percentOfScreenForMoving = 50;
            const start = (100 - percentOfScreenForMoving) / 2;
            const end = start + percentOfScreenForMoving;
            const cords = {
                start: width * start / 100,
                end: width * end / 100,
                // distance: 
                width: (width * end / 100) - (width * start / 100),
                scale: ((width * end / 100) - (width * start / 100)) / width
            }
            return cords;
    }

    return {
        images: array,
        imagesCount,
        changeImage
    }
}