
export default function headerLogo3d(selector) {
    const canvas = document.querySelector(selector);
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    const scene = new THREE.Scene();
    const loader = new THREE.ObjectLoader();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 0);

    camera.position.set(0, 0, 70);
    // console.log(scene);

    var clock = new THREE.Clock();
    loader.load(
        canvas.dataset.canvasLogo || "./static/model (12).json",
        function ( obj ) {
        const group = new THREE.Group();
        // console.log(obj);
        obj.material =  new THREE.MeshBasicMaterial({
        //   color: 0x0C50DB,
        color: 0xff3300,
        });

        scene.add( obj);
        obj.position.set(0,0,0)
        setInterval(() => {
        scene.children[0].rotation.set(90, -10, clock.getElapsedTime()*0.45);
        }, 10)
        },
        function ( xhr ) {
            // console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
        function ( err ) {
            console.error( 'An error happened' );
        }
    );
    let resizeTm;
    window.addEventListener('resize', () => {
    resizeTm = clearTimeout(resizeTm);
    resizeTm = setTimeout(onResize, 500);
    });
    function onResize() {
        canvas.style.width = '';
        canvas.style.height = '';
        width = canvas.offsetWidth;
        height = canvas.offsetHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }
    function render(a) {
        requestAnimationFrame(render);
        renderer.render(scene, camera);
    }
  requestAnimationFrame(render);
}