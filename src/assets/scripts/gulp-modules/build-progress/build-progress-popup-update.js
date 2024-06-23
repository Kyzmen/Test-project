export default async function buildProgressPopupUpdate(id, popup, onMutation = () => {}, dateInDigits) {
    const $container = document.querySelector('.build-cards-wrapper');
    const action = new FormData()
    action.append('action', 'buildProgress');
    action.append('id', id);
    let data = await fetch('/wp-admin/admin-ajax.php', {
        method: 'POST',
        body: action
    });
    data = await data.json();
    const text = popup.querySelector('.build-progress-popup__text-content'),
        title = popup.querySelector('.build-progress-popup__title'),
        date = popup.querySelector('.build-progress-popup__date'),
        imgContainer = popup.querySelector('.swiper-wrapper'),
        popupDataInDigits = popup.querySelector('.build-progress-popup__date');
    
    popupDataInDigits.textContent = dateInDigits ? dateInDigits : popupDataInDigits.textContent;
    title.textContent = data.date;
    text.innerHTML = data.text.join('<br><br>');

    imgContainer.innerHTML = '';
    data.gallery.forEach(el => {
        imgContainer.innerHTML += `
            <img class="swiper-slide" src="${el}" />
        `;
    })
    console.log(data);


    onMutation();
}