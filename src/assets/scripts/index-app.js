import i18next from 'i18next';
import gsap from 'gsap';
import axios from 'axios';
import * as yup from 'yup';
import FormMonster from '../../pug/components/form/form';
import SexyInput from '../../pug/components/input/input';
import { addIntersectionOnceWithCallback, isMobile, lazyImages, lazyPosters } from './modules/helpers/helpers';
import menuHandler from './modules/menu/menu';
import buttonHover from './modules/effects/buttonHover';
/** ******************************* */
/*
 * smooth scroll start
 */
global.gsap = gsap;
global.axios = axios;
/*
 * smooth scroll end
 */
/** ******************************* */
/** ******************************* */
/*
 * form handlers start
 */
lazyImages();
lazyPosters();
buttonHover('.button');


function calcViewportUnits() {
  let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// calcViewportUnits();
// window.addEventListener('resize', calcViewportUnits);


const formsWithTel = ['[data-home-contact]'];

formsWithTel.forEach(form => {
  const $form = document.querySelector(form);
  console.log(form);
  if ($form) {
    /* eslint-disable */
    new FormMonster({
      /* eslint-enable */
      elements: {
        $form,
        showSuccessMessage: false,
        successAction: () => {
          gsap.to('.form-wrapper-succes-layer', { autoAlpha: 1 });
          console.log('re');
        },
        $btnSubmit: $form.querySelector('[data-btn-submit]'),
        fields: {
          name: {
            inputWrapper: new SexyInput({ animation: 'none', $field: $form.querySelector('[data-field-name]') }),
            rule: yup.string().required(i18next.t('required')).trim(),
            defaultMessage: i18next.t('name'),
            valid: false,
            error: [],
          },
          // phone: {
          //   inputWrapper: new SexyInput({ animation: 'none', $field: $form.querySelector('[data-field-phone]') }),
          //   rule: yup.string().required(i18next.t('required')).trim(),
          //   defaultMessage: i18next.t('name'),
          //   valid: false,
          //   error: [],
          // },

          phone: {
            inputWrapper: new SexyInput({
              animation: 'none',
              $field: $form.querySelector('[data-field-phone]'),
              typeInput: 'phone',
            }),
            rule: yup
              .string()
              .required(i18next.t('required'))
              .min(15, i18next.t('field_too_short', { cnt: 19 - 8 })),

            defaultMessage: i18next.t('phone'),
            valid: false,
            error: [],
          },
        },
      },
    });
    // $form.querySelector('.js-mask-absolute').addEventListener('click', () => {
    //   $form.querySelector('[name="phone"]').focus();
    // }, false);
  }
});

const contactForms = ['[data-contact-page-form]'];
contactForms.forEach(form => {
  const $form = document.querySelector(form);
  console.log(form);
  if ($form) {
    /* eslint-disable */
    new FormMonster({
      /* eslint-enable */
      elements: {
        $form,
        showSuccessMessage: false,
        successAction: () => {
          const succesPoup = document.querySelector('.succes-popup');
          const closePopup = succesPoup.querySelector('button');
          closePopup.addEventListener('click', function removeThanks() {
            gsap.to(succesPoup, { autoAlpha: 0, clearProps: 'all' });
            closePopup.removeEventListener('click', removeThanks);
          })
          gsap.to(succesPoup, { autoAlpha: 1 });

          console.log('re');
        },
        $btnSubmit: $form.querySelector('[data-btn-submit]'),
        fields: {
          name: {
            inputWrapper: new SexyInput({ animation: 'none', $field: $form.querySelector('[data-field-name]') }),
            rule: yup.string().required(i18next.t('required')).trim(),
            defaultMessage: i18next.t('name'),
            valid: false,
            error: [],
          },
          phone: {
            inputWrapper: new SexyInput({
              animation: 'none',
              $field: $form.querySelector('[data-field-phone]'),
              typeInput: 'phone',
            }),
            rule: yup
              .string()
              .required(i18next.t('required'))
              .min(15, i18next.t('field_too_short', { cnt: 19 - 8 })),

            defaultMessage: i18next.t('phone'),
            valid: false,
            error: [],
          },
        },
      },
    });
    // $form.querySelector('.js-mask-absolute').addEventListener('click', () => {
    //   $form.querySelector('[name="phone"]').focus();
    // }, false);
  }
});

/** ******************************* */

const formWrapper = document.querySelector('[data-form-wrapper]');
const formWrapperCall = document.querySelectorAll('[data-call-form-popup]');
formWrapperCall.forEach(el => {
  el.addEventListener('click',function(evt){
    window.dispatchEvent(new Event('form-open'))
    gsap.timeline()
      .to( formWrapper, { autoAlpha: 1 } )
      .fromTo( 
        '.form-wrapper-left>*, .form-wrapper-right form>*', 
        { y: 50, autoAlpha: 0}, 
        { y: 0, autoAlpha: 1 }, 
        // { webkiClipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', stagger: 0.15 }, 
      // { webkiClipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', ease: 'power2.out' },
        '<'
      )
  })
});

document.body.addEventListener('click', (evt) => {
  if (evt.target.closest('[data-form-wrapper-call]') === null) return;
  window.dispatchEvent(new Event('form-open'))
    gsap.timeline()
      .to( formWrapper, { autoAlpha: 1 } )
      .fromTo( 
        '.form-wrapper-left>*, .form-wrapper-right form>*', 
        { y: 50, autoAlpha: 0}, 
        { y: 0, autoAlpha: 1 }, 
        // { webkiClipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', stagger: 0.15 }, 
      // { webkiClipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', ease: 'power2.out' },
        '<'
      )
})

function closeForm() {
  gsap.timeline({
  })
    
    .to('.form-wrapper-succes-layer', { autoAlpha: 0, duration: 0.25 })
    .fromTo( 
      '.form-wrapper-left>*, .form-wrapper-right form>*', 
      { y: 0, autoAlpha: 1}, 
      { y: 50, autoAlpha: 0 }, 
      // {webkiClipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', stagger: 0.15 }, 
      // {webkiClipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)', ease: 'power2.out' },
      '<'
    )
    .to(formWrapper, { autoAlpha: 0, duration: 0.25 }, '<+0.5');

}
formWrapper.querySelectorAll('[class*="close"]').forEach(closeBtn => {
  closeBtn.addEventListener('click',closeForm);
})


/** Mobile callback popup */
function mobPopupHandler() {
  function close(el) {
    gsap.to(el, { autoAlpha: 0, zIndex: 10 });
  }
  function open(el) {
    gsap.to(el, { autoAlpha: 1, zIndex: 50 });
  }
  const popup = document.querySelector('[data-mobile-callback-popup]');
  const call = document.querySelectorAll('[data-call-mobile-callback-popup]');
  const closeEl = document.querySelector('[data-mobile-callback-close]');
  closeEl.addEventListener('click', () => close(popup));

  popup.addEventListener('click', ({target}) => {
    target === popup ? close(popup) : null;
  })
  call.forEach(el => el.addEventListener('click', () => open(popup)));
  // call.forEach(el => el.addEventListener('touchstart', () => open(popup)));
}

mobPopupHandler();

menuHandler();

window.addEventListener('popup-open',function(evt){
  document.body.classList.add('popup-opened');
  
});
window.addEventListener('popup-close',function(evt){
  document.body.classList.remove('popup-opened');
});




window.addEventListener('menu-open',function lazeMenuStyle(evt){
  window.removeEventListener('menu-open', lazeMenuStyle);
  document.querySelectorAll('[data-style]').forEach(el => {
    el.style = el.dataset.style;
  });
});

window.addEventListener('form-open', function lazyForm() {
  window.removeEventListener('form-open', lazyForm);
  document.querySelectorAll('[data-form-src]').forEach(el => {
    el.src = el.dataset.formSrc;
  })
});

// document.querySelectorAll('img[data-src]').forEach(lazyItem => {

//   addIntersectionOnceWithCallback(lazyItem, () => {
//     lazyItem.src = lazyItem.dataset.src;
//   })
// })