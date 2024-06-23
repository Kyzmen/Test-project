import * as THREE from "three";
import gsap from 'gsap';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
export default function picturesHoverEffect(selector) {
    const $images = document.querySelectorAll(selector);

    const myEffect = {
        uniforms: {
          "tDiffuse": { value: null },
          "resolution": { value: new THREE.Vector2(1.,window.innerHeight/window.innerWidth) },
          "uMouse": { value: new THREE.Vector2(-10,-10) },
          "uVelo": { value: 0 },
        },
        vertexShader: `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );}`,
        fragmentShader: `uniform float time;
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        varying vec2 vUv;
        uniform vec2 uMouse;
        float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
          uv -= disc_center;
          uv*=resolution;
          float dist = sqrt(dot(uv, uv));
          return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
        }
        void main()  {

            
           // vec2 newUV = vUv;
           float c = circle(vUv, uMouse, 0.0, 0.2);
           // float r = texture2D(tDiffuse, newUV.xy += c * (0.05 * .5)).x;
           // float g = texture2D(tDiffuse, newUV.xy += c * (0.05 * .525)).y;
           // float b = texture2D(tDiffuse, newUV.xy += c * (0.05 * .55)).z;
            // vec4 color = vec4(r, g, b, 1.);
            vec2 newUV = mix(vUv, uMouse, c); 
            vec4 color = texture2D(tDiffuse,newUV);
            gl_FragColor = color;
        }`
      }

    // set up post processing
       

    $images.forEach(image => {
    //     console.log(image);
    //     const { width, height, left, right} = image.getBoundingClientRect();
    //     const scene = new THREE.Scene();
    //     const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
    //     let uMouse = new THREE.Vector2(0,0);
    //     const renderer = new THREE.WebGLRenderer();
    //     renderer.setSize( width,height );
    //     renderer.setPixelRatio( window.devicePixelRatio );
    //     renderer.domElement.setAttribute('data-webgl_rederer', '');
    //     image.insertAdjacentElement('beforebegin', renderer.domElement);

    //     let composer = new EffectComposer(renderer);
    //     let renderPass = new  RenderPass(scene, camera);
    //     // rendering our scene with an image
    //     composer.addPass(renderPass);
    //     camera.position.z = 700;
    //     camera.position.x = 0;
    //     window.camera1 = camera;
    //     let customPass = new  ShaderPass(myEffect);
    //     // making sure we are rendering it.
    //     customPass.renderToScreen = true;
    //     composer.addPass(customPass);
    
    //     // actually render scene with our shader pass
    //     composer.render();
    //     var animate = function () {
    //         customPass.uniforms.uMouse.value = uMouse;
    //   requestAnimationFrame( animate );

    //   // renderer.render( scene, camera );
    //   composer.render()
    //     };

    //     let TEXTURE = new THREE.TextureLoader().load(image.dataset.webgl, (tex) => {
    //         tex.needsUpdate = true;
    //         mesh.scale.set(1.0,   tex.image.width/tex.image.height, 1.0);
    //     }); 
    //     let mesh = new THREE.Mesh(
    //         new THREE.PlaneBufferGeometry(width, height), 
    //         new THREE.MeshBasicMaterial({ map: TEXTURE})
    //     );
    //     console.log(mesh);
    //     mesh.scale.set(1.0,  width / height, 1.0);
    //         scene.add(mesh);
    //         image.style.visibility = 'hidden';
    //         image.style.display = 'none';
    //         animate();
    //     const container = image.parentElement;
    //     container.addEventListener('mousemove', (e) => {
    //         // mousemove / touchmove
    //         console.log((e.clientX  / window.innerWidth) + (left / window.innerWidth));
    //         if (container.isAnimating === true) return;
    //         uMouse.x = ( e.clientX  / window.innerWidth ) ;
    //         uMouse.y = 1. - ( e.clientY/ window.innerHeight );
    //     });
    //     container.addEventListener('mouseleave', (e) => {
    //         gsap.to(uMouse, { x: 0, y: 0, onUpdate: () => console.log('ffff') })
    //         // uMouse = new THREE.Vector2(-100,-100)
    //     });
    //     container.addEventListener('mouseenter', (e) => {
    //         console.log(( e.clientX  / window.innerWidth ), 1. - ( e.clientY/ window.innerHeight ));
    //         gsap.timeline()
    //         .add(() => container.isAnimating = true)
    //         .to(
    //             uMouse, 
    //             { 
    //                 x: ( e.clientX  / window.innerWidth ) , 
    //                 y:  1. - ( e.clientY/ window.innerHeight ), 
    //             }
    //         )
    //         .add(() => container.isAnimating = false)
    //         // uMouse = new THREE.Vector2(-100,-100)
    //     });
    aa(image);
    })
    // animate();


}

function aa(image) {
    var camera, scene, renderer, composer,renderPass,customPass;
    var geometry, material, mesh, texture,uMouse = new THREE.Vector2(0,0);
    var img = image;
    const { innerHeight, innerWidth } = window;
    const { width, height, left, right} = image.getBoundingClientRect();
    let dummyimg = image;
    dummyimg.onload = function(){
      document.body.classList.remove('loading')
      img.style.display = 'none';
      texture = new THREE.Texture( this );
      texture.needsUpdate = true;
      
      init()
      animate();
    }
    dummyimg.src = img.src;

    function init() {
      console.log(texture);
      camera = new THREE.PerspectiveCamera( 70, width / height, 0.01, 10 );
      camera.position.z = width*0.0003;

      scene = new THREE.Scene();

      geometry = new THREE.PlaneGeometry( width*0.001, height*0.001);
      material = new THREE.MeshBasicMaterial({
        map: texture
      });
      mesh = new THREE.Mesh( geometry, material );
      scene.add( mesh );

      renderer = new THREE.WebGLRenderer( { antialias: true } );
      renderer.setSize( width, height );
      renderer.outputEncoding = THREE.sRGBEncoding;
      image.parentElement.appendChild( renderer.domElement );

      // post processing
      composer = new EffectComposer(renderer);
      renderPass = new RenderPass(scene, camera);
      composer.addPass(renderPass);

      var myEffect = {
        uniforms: {
          "tDiffuse": { value: null },
          "resolution": { value: new THREE.Vector2(1.,height / width) },
          "uMouse": { value: new THREE.Vector2(-10,-10) },
          "uVelo": { value: 0 },
        },
        vertexShader: `varying vec2 vUv;void main() {vUv = uv;gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );}`,
        fragmentShader: `uniform float time;
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        varying vec2 vUv;
        uniform vec2 uMouse;
        float circle(vec2 uv, vec2 disc_center, float disc_radius, float border_size) {
          uv -= disc_center;
          uv*=resolution;
          float dist = sqrt(dot(uv, uv));
          return smoothstep(disc_radius+border_size, disc_radius-border_size, dist);
        }
        void main()  {
            vec2 newUV = vUv;
            float c = circle(vUv, uMouse, 0.0, 0.2);
            float r = texture2D(tDiffuse, newUV.xy += c * (0.1 * .5)).x;
            float g = texture2D(tDiffuse, newUV.xy += c * (0.1 * .525)).y;
            float b = texture2D(tDiffuse, newUV.xy += c * (0.1 * .55)).z;
            vec4 color = vec4(r, g, b, 1.);

            gl_FragColor = color;
        }`
      }

      customPass = new ShaderPass(myEffect);
      customPass.renderToScreen = true;
      composer.addPass(customPass);

    }
  function getRelativeCoordinates (event, referenceElement) {
    const { width, height, top } = referenceElement.getBoundingClientRect();
    const position = {
      x: event.pageX,
      y: event.clientY
    };

    const offset = {
      left: referenceElement.offsetLeft,
      top: top
    };

    let reference = referenceElement.offsetParent;

    while(reference){
      offset.left += reference.offsetLeft;
      offset.top += top;
      reference = reference.offsetParent;
    }

    return { 
      x: (position.x - offset.left) / width,
      y: (position.y - top) / height,
    }; 

  }
    image.parentElement.addEventListener('mousemove', (e) => {
      // mousemove / touchmove
      const { x, y } =  getRelativeCoordinates(e, image.parentElement);
      uMouse.x = x;
      uMouse.y = 1 - y;
    });

    function animate() {
      customPass.uniforms.uMouse.value = uMouse;
      requestAnimationFrame( animate );

      // renderer.render( scene, camera );
      composer.render()

    }

    window.addEventListener( 'resize', onWindowResize, false );

    function onWindowResize(){
        const { width, height, left, right} = image.parentElement.getBoundingClientRect();
        console.log(camera);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();

        renderer.setSize( width, height );

    }
}