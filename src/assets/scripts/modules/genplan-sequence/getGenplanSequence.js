export function getGenplanSequences({ options = {} }) {
    let URL = window.location.href.match(/localhost/) || document.documentElement.dataset.mode == 'local' ? './static/genplan-final.json' : '/wp-content/themes/central-park/static/final.json';
    return axios(URL, {
        ...options
    })
}