console.log('laoder');



let loaderStatus = {
    isCounterAnim: true,
    isDOMLoaded: false,
}
if (sessionStorage.getItem('visit') !== null) {
    document.querySelector('.loader').classList.add('hidden');
    loaderStatus.isCounterAnim = false;
    loaderStatus.isCounterAnim = true;
} else {
    sessionStorage.setItem('visit', true);
}
function scaleTo1(el) {
    const path = el;
    let value = 1;
    const finishVal = +el.dataset.finishVal || 0;
    function render(value) {
        
        if (value <= 0.15) {
            // el.parentElement.classList.add('transformed');

        }
        if(value <= finishVal) {
            document.querySelector('.loader').classList.add('hidden');
            // document.querySelector('.loader>svg').style.opacity = 0;
            loaderStatus.isCounterAnim = false;
            path.style.transform = `scaleY(${finishVal})`;
            return;
        };
        path.style.transform = `scaleY(${value})`;
        const newValue = value - 0.01;
        requestAnimationFrame(() => {
            render(newValue);
        });
    }

    render(value);
}


function digitLoader() {
    const el = document.querySelector('.loader__counter');
    let value = 0;

    function render(value) {
        if (value >= 101) {
            
            
            return;
        };
        let newValue = value + 1;
        el.textContent = value;
        requestAnimationFrame(() => {
            render(newValue);
        })
    }
    // document.querySelector('.loader__lines').classList.remove('gradient');
    
    linesTo0();
    render(value);
}
digitLoader();

function linesTo0() {
    for (let index = 0; index < document.querySelectorAll('.loader path:not(.static)').length; index++) {
        const element = document.querySelectorAll('.loader path:not(.static)')[index];
        scaleTo1(element);
    }
}

let interval = setInterval(() => {
    if (loaderStatus.isCounterAnim === false && loaderStatus.isDOMLoaded === true) {
        
        window.dispatchEvent(new Event('preloaderOff'));
        clearInterval(interval);
    }
}, 100);
window.addEventListener('DOMContentLoaded',function(evt){
    loaderStatus.isDOMLoaded = true;
});