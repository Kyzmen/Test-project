import gsap from 'gsap';
import { transitionBetweenSectionSceneLength } from '../../modules/helpers/helpers';




export default async function screen9Handler(scroller) {
    const container = document.querySelector('.screen9');
    const frame = container.querySelector('iframe');
    let detailLinks = [
        '#',
        '#',
    ];
    let testData = [
        'Квартира 1А <br><br> Простора світла однокімнатна квартира площею 44 м2 з кухнею-вітальнею та спальною кімнатою. У кухні-вітальні передбачено зону для приготування та споживання їжі та зону відпочинку з комфортним диваном та телевізором. У спальній кімнаті розміщується велике двоспальне ліжко, телевізор, трюмо, м’яке крісло, а також гардеробна. У коридорі зосереджені зони для зберігання речей: шафа та консоль. Ванна кімната вміщує ванну, умивальник, пральну машинку, унітаз. В даному плануванні все фунцкціональне та продумане для комфортного життя.',
        'Квартира 1Б <br><br> У плануванні 1-к квартири загальною площею 43.7 м2 все лаконічно: кухня-вітальня, спальна кімната, гардеробна, ванна. У кухні вітальні виділено дві зони: приготування та споживання їжі та відпочинкову зону з диваном та телевізором. У спальні розміщено велике двоспальне ліжко, телевізор, трюмо, приліжкову тумбочку, стелаж для книг та сувенірів, а також гардероб. У коридорі зосереджені зони для зберігання речей: шафа та консоль, а також є окрема кладова. Ванна кімната вміщує ванну, умивальник, унітаз. Чудовий варіант для міського ритму життя.',
        // 'Площа квартири 56,7 м2. Містка гардеробна. Кухня площею 15,6 м2 із зоною для приготування та споживання улюблених страв. Спальня площею 17,7 м2 з ліжком, телевізором, трюмо та зоною для зберігання. Панорамні вікна з виглядом на лісопаркову зону.',
        // 'Площа квартири 57,7 м2. Містка гардеробна. Кухня площею 15,6 м2 із зоною для приготування та споживання улюблених страв. Спальня площею 17,7 м2 з ліжком, телевізором, трюмо та зоною для зберігання. Панорамні вікна з виглядом на лісопаркову зону. Скористайтесь функцією 3D-туру квартирою, і Ви впевнитесь у зручності її планування та функціональності.',
        // 'Площа квартири 58,7 м2. Містка гардеробна. ',
    ];
    let testSrc = [
        'https://vrnet.io/view5.16a/?model=ua/bmu6/cp/1a',
        'https://vrnet.io/view5.16a/?model=ua/bmu6/cp/1b',
        // 'https://ua-maps3d.vrnet.io/view5.16a/?model=ua/bmu6/forresthome/2zhe',
        // 'https://ua-maps3d.vrnet.io/view5.16a/?model=ua/bmu6/forresthome/3zhe',
        // 'https://ua-maps3d.vrnet.io/view5.16a/?model=ua/bmu6/forresthome/4zhe',
    ];

    if (document.documentElement.dataset.mode !== 'local') {
        const sdata = new FormData();
        sdata.append('action', 'getVirtual');
        let request = await fetch('/wp-admin/admin-ajax.php', {
            body: sdata,
            method: 'POST'
        });
        request = await request.json();
        let backgrounds = [];
        request.forEach((data, index) => {
            testData[index] = data.text;
            testSrc[index] = data['3d_url'];
            detailLinks[index] = data.btn_url;
            backgrounds.push(data.img);
        });
        frame.dataset.backgrounds = backgrounds.join('~');
    }


    
    if (container === null) return;
    let currentIndex = 0;
    const isMobile = window.matchMedia('(max-width: 575px)').matches;
    
    const textBlock = container.querySelector('.screen9__right p'),
    navNext = container.querySelector('[data-nav-wrap] svg:nth-child(2)'),
    navPrev = container.querySelector('[data-nav-wrap] svg:nth-child(1)'),
    counterCurrent = container.querySelector('[data-current]'),
    counterNext = container.querySelector('[data-all]');
    const iframeWrap = container.querySelector('[data-vr-frame]');
    const svgBg = container.querySelectorAll('[data-screen9-bg] path');
    const frameOtherEls = iframeWrap.querySelectorAll('.screen9__center-button, .subtitle.text-white');
    const frameBgs = frame.dataset.backgrounds.split('~');
    const link = container.querySelector('a.button');
    iframeWrap.addEventListener('click', function changeSrc() {
        gsap.to(frameOtherEls, { y: 50, autoAlpha: 0, clearProps: 'transform' })
        frame.src = frame.dataset.src;
    });
    link.setAttribute('href', detailLinks[0]);
    textBlock.innerHTML = testData[0];
    frame.dataset.src = testSrc[0];
    frame.style.backgroundImage = `url(${frameBgs[0]})`;
    if (counterNext) counterNext.textContent = testData.length;
    navNext.addEventListener('click', () => {
        scaleDownAndUp(svgBg);
        curtainOpenCloseWithCallback(container.querySelectorAll('.curtain'), () => {
            let nextIndex = currentIndex === testData.length - 1 ? 0 : currentIndex + 1;
            textBlock.innerHTML = testData[nextIndex];
            link.setAttribute('href', detailLinks[nextIndex]);
            frame.dataset.src = testSrc[nextIndex];
            frame.style.backgroundImage = `url(${frameBgs[nextIndex]})`;
            frame.removeAttribute('src');
            gsap.to(frameOtherEls, { y: 0, autoAlpha: 1, clearProps: 'transform' })
            if (counterCurrent) counterCurrent.textContent = nextIndex + 1;
            currentIndex = nextIndex;
        })
    })
    navPrev.addEventListener('click', () => {
        scaleDownAndUp(svgBg);
        curtainOpenCloseWithCallback(container.querySelectorAll('.curtain'), () => {
            let nextIndex = currentIndex === 0  ? testData.length - 1 : currentIndex - 1;
            link.setAttribute('href', detailLinks[nextIndex]);
            textBlock.innerHTML = testData[nextIndex];
            frame.dataset.src = testSrc[nextIndex];
            frame.style.backgroundImage = `url(${frameBgs[nextIndex]})`;
            frame.removeAttribute('src');
            gsap.to(frameOtherEls, { y: 0, autoAlpha: 1, clearProps: 'transform' })
            if (counterCurrent) counterCurrent.textContent = nextIndex + 1;
            currentIndex = nextIndex;
        })
    })

    // !isMobile && gsap.timeline({
    //     scrollTrigger: {
    //       trigger: '.screen9',
    //       scrub: true,
    //       scroller: scroller ? scroller : null,
    //       ...transitionBetweenSectionSceneLength(),
    //     }
    //   })
    //     .from('.screen9__left, .screen9__center, .screen9__right', { y: 100 })
    //     // .to('.screen8__render', { scale: 0.8 }, '<')
    
}
function scaleDownAndUp($el) {
    gsap.timeline()
        .set($el, { attr: {
            class: 'effecting-in'
        }})
        .set($el, { attr: {
            class: 'effecting-out'
        }}, '<+1')
}
function curtainOpenCloseWithCallback(el, cb = () => {}) {
    gsap.timeline()
        .to(el, {
            scaleX: 1,
            ease: 'power2.out'
        })
        .add(cb)
        .to(el, {
            scaleX: 0,
            transformOrigin: '0% 50%',
            clearProps: 'all',
            ease: 'power2.in'
        })
}


