import * as THREE from 'three';
import gsap from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';
export default function webglWaves(img, scroller) {
    const canvas = document.createElement('canvas');
    const wrap = document.createElement('div');
    const { width, height } = img.getBoundingClientRect();
    canvas.style.cssText += `
        width:100%;
        height: 100%;
        position:relative;
        z-index:2;
    `;
    wrap.style.cssText += `
        position: absolute;
        left: 0;
        top: 0;
        width:100%;
        height: 100%;
    `;
    wrap.append(canvas);
    img.parentElement.append(wrap);
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true 
    });
    renderer.setPixelRatio(gsap.utils.clamp(1.5, 1, window.devicePixelRatio));
    renderer.setSize(width, height);
    const camera = new THREE.PerspectiveCamera(45, 16/10, 0.1, 1000);
    camera.position.z = 0.99
    window.camera = camera;
    const geometry = new THREE.PlaneGeometry(1.6, 1.0, 16, 16);
    const material = new THREE.ShaderMaterial({
        vertexShader: `
        precision mediump float;

        varying vec2 vUv;
        varying float vWave;
        uniform float uTime;

        //
        // Description : Array and textureless GLSL 2D/3D/4D simplex
        //               noise functions.
        //      Author : Ian McEwan, Ashima Arts.
        //  Maintainer : ijm
        //     Lastmod : 20110822 (ijm)
        //     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
        //               Distributed under the MIT License. See LICENSE file.
        //               https://github.com/ashima/webgl-noise
        //

        vec3 mod289(vec3 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
        return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
            return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r)
        {
        return 1.79284291400159 - 0.85373472095314 * r;
        }

        float snoise(vec3 v) {
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        
        // First corner
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 =   v - i + dot(i, C.xxx) ;
        
        // Other corners
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );

        //   x0 = x0 - 0.0 + 0.0 * C.xxx;
        //   x1 = x0 - i1  + 1.0 * C.xxx;
        //   x2 = x0 - i2  + 2.0 * C.xxx;
        //   x3 = x0 - 1.0 + 3.0 * C.xxx;
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
        vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y
        
        // Permutations
        i = mod289(i);
        vec4 p = permute( permute( permute(
                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                
        // Gradients: 7x7 points over a square, mapped onto an octahedron.
        // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
        float n_ = 0.142857142857; // 1.0/7.0
        vec3  ns = n_ * D.wyz - D.xzx;

        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);

        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );

        //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
        //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));

        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        
        // Normalise gradients
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        
        // Mix final noise value
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                        dot(p2,x2), dot(p3,x3) ) );
        }

        void main() {
        vUv = uv;

        vec3 pos = position;
        float noiseFreq = 3.5;
        float noiseAmp = 0.15;
        vec3 noisePos = vec3(pos.x * noiseFreq + uTime, pos.y, pos.z);
        pos.z += snoise(noisePos) * noiseAmp;
        vWave = pos.z;

        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
        }
        `,
        fragmentShader: `
        precision mediump float;

        varying vec2 vUv;
        varying float vWave;
        uniform float uSaturation;
        uniform sampler2D uTexture;
        
        void main() {
          float wave = vWave * 0.025 * uSaturation;
          float r = texture2D(uTexture, vUv).r;
          float g = texture2D(uTexture, vUv + (wave)).g;
          float b = texture2D(uTexture, vUv + wave).b;
          vec3 texture = vec3(r, g, b);
          gl_FragColor = vec4(texture, 1.);
        }
        `,
        uniforms: {
            uSaturation: { value: 0.0 },
            uTime: { value: 0.0 },
            uTexture: { value: new THREE.TextureLoader().load(
                img.src,
                function ( texture ) {
                    // in this example we create the material when the texture is loaded
                    // console.log(texture);
                    // const material = new THREE.MeshBasicMaterial( {
                    //     map: texture
                    //  } );
                },
            ) },
        },
        side: THREE.DoubleSide
    });
    
    canvas.addEventListener('mouseenter',function(evt){
        gsap.to(material.uniforms.uSaturation, { value: 1.0 })
    });
    canvas.addEventListener('mouseleave',function(evt){
        gsap.to(material.uniforms.uSaturation, { value: 0.0 })
    });
    const mesh = new THREE.Mesh(geometry, material);
    const clock = new THREE.Clock();
    scene.add(mesh);
    function render() {
        // renderer.setClearColor(0xF2F2F2, 0);
        renderer.setClearColor( 0x000000, 0 );
        material.uniforms.uTime.value = clock.getElapsedTime();
        renderer.render(scene, camera);
        // console.log(clock);
        requestAnimationFrame(render); 
    }
    render();
    mesh.position.y = gsap.utils.mapRange(0,1, 0.05, -0.05, 0);
    ScrollTrigger.create({
        trigger: canvas,
        scroller: scroller ? scroller : null,
        scrub: true,
        onUpdate: ({ progress }) => {
            mesh.position.y = gsap.utils.mapRange(0,1, 0.05, -0.05, progress);
        }
    })
    // console.log(THREE);
}