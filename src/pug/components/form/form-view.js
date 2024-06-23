import onChange from 'on-change';
import i18next from 'i18next';
import MyToster from '../toster/toster';

// BEGIN

const renderForm = (form, elements, toast) => {
  const elementsParamFn = elements;
  const fieldsKey = Object.keys(elements.fields);

  switch (form.status) {
    case 'renderErrorValidation':
      elementsParamFn.$btnSubmit.setAttribute('disabled', true);
      fieldsKey.forEach((key) => {
        const field = elementsParamFn.fields[key];
        if (field.valid) {
          field.inputWrapper.showSuccessStyle();
          field.inputWrapper.writeMessage('');
          if (elementsParamFn.showSuccessMessage) {
            field.inputWrapper.writeMessage(field.defaultMessage);
          }
        } else {
          field.inputWrapper.showErrorStyle();
          field.inputWrapper.addSelectedStyle();
          field.inputWrapper.writeMessage(field.error[0]);
        }
      });
      break;
    case 'renderSuccessValidation':
      elementsParamFn.$btnSubmit.removeAttribute('disabled');

      fieldsKey.forEach((key) => {
        const field = elementsParamFn.fields[key];
        field.inputWrapper.showSuccessStyle();
        field.inputWrapper.writeMessage('');
      });
      break;

    case 'loading':
      fieldsKey.forEach((key) => {
        const field = elementsParamFn.fields[key];
        field.inputWrapper.showLoadingStyle();
      });

      elementsParamFn.$btnSubmit.setAttribute('disabled', true);
      elementsParamFn.$btnSubmit.querySelector('[data-btn-submit-text]').innerHTML = i18next.t(
        'sending',
      );

      break;
    case 'successSand':
      fieldsKey.forEach((key) => {
        const field = elementsParamFn.fields[key];
        field.inputWrapper.showDefaultStyle();
        field.inputWrapper.removeSelectedStyle();
      });
      elementsParamFn.$form.reset();
      elementsParamFn.$btnSubmit.setAttribute('disabled', false);
      elementsParamFn.$btnSubmit.querySelector('[data-btn-submit-text]').innerHTML = i18next.t(
        'send',
      );
      /*  */
      window.dispatchEvent(new Event('succesFormSend'));
      if (elementsParamFn.successAction === 'toster') {
        toast.addToast({
          type: 'success',
          text: i18next.t('sendingSuccessText'),
          title: i18next.t('sendingSuccessTitle'),
        });
      }
      if (typeof elementsParamFn.successAction === 'function') {
        elementsParamFn.successAction();
      }
      break;

    case 'filling':
      break;
    case 'failed':
      toast.addToast({
        type: 'error',
        text: i18next.t(form.serverError),
        title: 'Сталася помилка',
      });
      elementsParamFn.$btnSubmit.removeAttribute('disabled');
      elementsParamFn.$btnSubmit.querySelector('[data-btn-submit-text]').innerHTML = i18next.t(
        'send',
      );
      break;
    default:
      throw Error(`Unknown form status: ${form.status}`);
  }
};


const initView = (state, elementsParamFn) => {
  const toast = new MyToster({
    $wrap: document.querySelector('[data-toast-wrapper]'),
  });

  const mapping = {
    status: () => renderForm(state, elementsParamFn, toast),
  };

  const watchedState = onChange(state, (path) => {
    if (mapping[path]) {
      mapping[path]();
    }
  });

  return watchedState;
};

export default initView;
// END
