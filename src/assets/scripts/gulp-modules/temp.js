import { fromPathToArray } from '../modules/helpers/helpers';



document.querySelectorAll('[data-screen1-hor-lines]').forEach(changeScreen1Path);

if (window.matchMedia('(min-width:2100px)').matches) {
    document.querySelectorAll('[data-screen1-text]').forEach(changeScreen1Text);
}

function changeScreen1Path(path) {
    const d = path.getAttribute('d');
    const parsedPathCords = fromPathToArray(d );
    const itemToChange = parsedPathCords[1];
    let box = path.closest('svg').getAttribute('viewBox');
    box = box.split(/\s+|,/);
    itemToChange.x -= (innerWidth - box[2]);
    let result = Object.values(parsedPathCords).map(el => Object.values(el).join(' ')).join(' ');
    path.setAttribute('d', result);
}
function changeScreen1Text(path) {
    let box = path.closest('svg').getAttribute('viewBox');
    box = box.split(/\s+|,/);
    const x = +path.getAttribute('x');
    path.setAttribute('x', -220);
}

window.addEventListener('resize', () => {
    document.querySelectorAll('[data-screen1-hor-lines]').forEach(changeScreen1Path);
})