import Swiper from 'swiper';
// import { getGenplanSequences, changeImageSrcByArrayIndex } from "../../modules/genplan-sequence/genplan-sequence";
import { gsap, ScrollTrigger } from 'gsap/all';
import { debounce } from '../../modules/helpers/helpers';
import { getGenplanSequences } from '../../modules/genplan-sequence/getGenplanSequence';
import { changeImageSrcByArrayIndex } from '../../modules/genplan-sequence/changeImgSrcByArrayIndex';


const clickSequences = {
    
        /*'5 заїздів roads'*/ 0: '0-79',
        /*'Територія sidewalks'*/ 1: '80-141',
        /*'Рекреація playground'*/ 2: '142-160',
        /*'Комфорт school'*/ 3: '165-179',
        /*'Бізнес commerce '*/ 4: '184-188',
}

export default async function screen55(scroller) {
    global.gsap = gsap;
    gsap.core.globals("ScrollTrigger", ScrollTrigger);

    if (window.matchMedia('(max-width: 1024px)').matches) {
        screen55Mobile();
        return;
    }

    const $itemForImageRender = document.querySelector('[data-screen5-image]');
    const $legendItems = document.querySelectorAll('.genplan-legend-item');
    $legendItems.forEach((el, index) => {
        el.sequenceIndex = index;
    });

    // $legendItems[0].classList.add('active');
    let SEQUENCES = await getGenplanSequences({});
    let isAnimating = false;

    document.querySelectorAll('.screen5-5-loader').forEach(el => el.remove());
    document.querySelectorAll('.screen5-5.loading').forEach(el => el.classList.remove('loading'));

    // const clickSequences = {

    //     /*'5 заїздів'*/ 0: '0-81',
    //     /*'Територія'*/ 1: '82-142',
    //     /*'Рекреація'*/ 2: '143-158',
    //     /*'Комфорт'*/ 3: '162-181',
    //     /*'Бізнес'*/ 4: '179-200',
    // };
    
    // /*teritorry */ 0: '1-70', 
    // /*recreating */ 1: '142-160', 
    // /*confort */ 2: '71-110', 
    // /*business */ 3: '113-127'
    let previousSequence = false;
    let sequenceWaiting = false;

    window.foToMapIndex = (index) => {
        $itemForImageRender.src = SEQUENCES.data[index];
    }

    function changeActiveSequence(index) {


        const $item = $legendItems[index];
        $legendItems.forEach(el => {
            if ($item === el) return;
            el.classList.remove('active');
        });
        $item.classList.add('active');
        const currentSequenceToRender = clickSequences[index];

        if (isAnimating) { 
            // sequenceWaiting = currentSequenceToRender;
            return;
        }

        if (previousSequence === currentSequenceToRender) return;
        isAnimating = true;
        if (previousSequence) {
            changeImageSrcByArrayIndex($itemForImageRender, SEQUENCES.data, +previousSequence.split('-')[1], +previousSequence.split('-')[0], () => {
                changeImageSrcByArrayIndex($itemForImageRender, SEQUENCES.data, +currentSequenceToRender.split('-')[0], +currentSequenceToRender.split('-')[1], () => {
                    if (sequenceWaiting) {
                        changeImageSrcByArrayIndex($itemForImageRender, SEQUENCES.data, +sequenceWaiting.split('-')[0], +sequenceWaiting.split('-')[1], () => {
                            sequenceWaiting = false;
                            isAnimating = false;
                        })
                    } else {
                        isAnimating = false;
                    }
                });
                
            })
        } else {
            changeImageSrcByArrayIndex($itemForImageRender, SEQUENCES.data, +currentSequenceToRender.split('-')[0], +currentSequenceToRender.split('-')[1], () => {
                isAnimating = false;
            })
        }
        previousSequence = currentSequenceToRender;
    }

    $itemForImageRender.src = SEQUENCES.data[0];

    const legendItemsHeight = Array.from(document.querySelectorAll('.genplan-legend-item, .genplan-legend-item-line')).reduce((acc,el) => {acc+=parseInt(getComputedStyle(el).height); return acc}, 0);

    gsap.set(".screen5-5.infrastructure", { height: legendItemsHeight  });

    gsap.timeline({
        scrollTrigger: {
            scroller: scroller ? scroller : null,
            trigger: ".screen5-5.infrastructure",
            scrub: true,
            end: "100% bottom",
            pin: ".screen5-5__container",
            invalidateOnRefresh: true,
            onUpdate: ({ start, end, ...e}) => {
                if (e.progress === 1) return;
                const distance = end - start;
                const percenteOfScreenHeightDueToSceneLength = window.innerHeight * 100 / distance / 100;
                document.querySelector('.genplan-legend').style.cssText = `--percent: ${ (100 - (e.progress + (percenteOfScreenHeightDueToSceneLength / 2)) * 100)}%`;
                changeActiveSequence(findClosestToCenter($legendItems));
            }
        }  
    })
        .to('.screen5-5__left', {
            y: (legendItemsHeight * -1) + (window.innerHeight)
        })

}


function getHeight(el) {
    return el.getBoundingClientRect().height;
}
function getWidth(el) {
    return el.getBoundingClientRect().width;
}

function findClosestToCenter(arr) {
    let closestIndex = 0;
    let closestDistance = Math.abs(window.innerHeight/2 - arr[0].getBoundingClientRect().top - arr[0].getBoundingClientRect().height/2);
  
    for(let i = 1; i < arr.length; i++) {
        const distance = Math.abs(window.innerHeight/2 - arr[i].getBoundingClientRect().top - arr[i].getBoundingClientRect().height/2);
        if(distance < closestDistance) {
            closestIndex = i;
            closestDistance = distance;
        }
    }

    return closestIndex;
}


async function screen55Mobile() {

    const $itemForImageRender = document.querySelector('[data-mobile-infrastructure-canvas]');
    const $itemForImageRenderContainer = $itemForImageRender.parentElement;

    const swiper = new Swiper('.screen5-5-mobile-swiper', {
        slidesPerView: 1.5,
        slideToClickedSlide: true,

    });
    let SEQUENCES = await getGenplanSequences({});

    document.querySelectorAll('.screen5-5-mobile-loader').forEach(el => el.remove());
    document.querySelectorAll('.screen5-5-mobile.loading').forEach(el => el.classList.remove('loading'));
    // const clickSequences = {

    //     /*'5 заїздів'*/ 0: '0-81',
    //     /*'Територія'*/ 1: '82-144',
    //     /*'Рекреація'*/ 2: '145-161',
    //     /*'Комфорт'*/ 3: '162-178',
    //     /*'Бізнес'*/ 4: '179-203',
    //     // /*teritorry */ 0: '1-70', 
    //     // /*confort */ 1: '71-110', 
    //     // /*business */ 2: '113-127', 
    //     // // /*recreating */ 3: '142-160'
    //     // /*recreating */ 3: '164-178'
    // };
    
    // /*teritorry */ 0: '1-70', 
    // /*recreating */ 1: '142-160', 
    // /*confort */ 2: '71-110', 
    // /*business */ 3: '113-127'

    let previousSequence = false;

    $itemForImageRenderContainer.scrollTo(getWidth($itemForImageRender) * 0.88 - window.innerWidth,0);

    changeImageSrcByArrayIndex($itemForImageRender, SEQUENCES.data, +clickSequences[0].split('-')[0], +clickSequences[0].split('-')[1], () => {
        // isAnimating = false;
        swiper.enable();
    })

    swiper.on('activeIndexChange', ({ activeIndex }) => {
        // console.log(e);
        let currentSequenceToRender = clickSequences[activeIndex];
        if (!currentSequenceToRender) return;
        swiper.disable();
        if (previousSequence) {
            changeImageSrcByArrayIndex($itemForImageRender, SEQUENCES.data, +previousSequence.split('-')[1], +previousSequence.split('-')[0], () => {
                changeImageSrcByArrayIndex($itemForImageRender, SEQUENCES.data, +currentSequenceToRender.split('-')[0], +currentSequenceToRender.split('-')[1], () => {
                    swiper.enable();
                });                
            })
        } else {
            changeImageSrcByArrayIndex($itemForImageRender, SEQUENCES.data, +currentSequenceToRender.split('-')[0], +currentSequenceToRender.split('-')[1], () => {
                // isAnimating = false;
                swiper.enable();
            })
        }
        previousSequence = currentSequenceToRender;
    });
    mobileFaqHandler();
    handleMobileBlockImageHorizontalScroll(document.querySelector('.screen5-5-mobile__scroller svg'));
}


function handleMobileBlockImageHorizontalScroll(el) {
    const parent = el.closest('.screen5-5-mobile');
    const slider = parent.querySelector('input');
    const sliderSvg = el;
    const slideSvgButton = sliderSvg.querySelector('.swipe');
    const slideSvgButtonRadius = +slideSvgButton.querySelector('circle').getAttribute('r');
    const imageScrollContainer = parent.querySelector('.screen5-5-mobile__top');
    const sliderSvgWidth = sliderSvg.getAttribute('viewBox').split(' ')[2];
  
    slider.value = 0;
    slider.setAttribute('max', imageScrollContainer.scrollWidth);
  
    sliderSvg.insertAdjacentHTML('afterbegin', `
      <circle cx="30" cy="30" r="29.5" stroke="#23242B" stroke-dasharray="1 10" class="Ellipse 83"></circle>
    `);
    slider.addEventListener('input', (evt) => {
      imageScrollContainer.scrollTo({
        left: evt.target.value - window.innerWidth / 2
      });
  
      const swipeXoffset = gsap.utils.mapRange(
        0 ,
        evt.target.getAttribute('max'),
        slideSvgButtonRadius * 2, sliderSvgWidth,
        evt.target.value
      );
      slideSvgButton.setAttribute('transform', `translate(${swipeXoffset - (slideSvgButtonRadius * 2)} ,0)`)
    });
  
    slider.value = imageScrollContainer.scrollWidth / 2;
    slider.dispatchEvent(new Event('input'));
  }


function mobileFaqHandler() {
    document.body.addEventListener('click',function(evt){
        const target = evt.target.closest('[data-mobile-open-legend-faq]');
        if (!target) return;
        target.closest('.genplan-titles-faq').classList.toggle('active');
    });
}