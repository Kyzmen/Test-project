export function changeImageSrcByArrayIndex(toDisplay, images, start, end, cb = () => {}) {
    const delay =  1000 / 30;
    function change(i) {
        toDisplay.src = images[i];
        if (i === end) return cb();
        setTimeout(() => {
            requestAnimationFrame(() => {
                start > end ? change(i - 1) : change(i + 1);
            })
        }, delay);
    }
    change(start);
}