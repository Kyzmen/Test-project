import {Curtains, Plane, Vec2, Vec3, Vec4, ShaderPass, TextureLoader, Texture} from 'curtainsjs';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
// import {gsap, smoothScroll, ScrollTrigger} from './gsap/gsapWithProxy';
export default function curtainsShaders(smoothScroll){
    // we will keep track of all our planes in an array
    const planes = [];
    let scrollEffect = 0;

    // get our planes elements
    const planeElements = document.getElementsByClassName("plane");

    
    const useNativeScroll = smoothScroll.isMobile;
    let planesDeformations = 0;
    // set up our WebGL context and append the canvas to our wrapper
    const curtains = new Curtains({
        container: "canvas",
        watchScroll: useNativeScroll, // watch scroll on mobile not on desktop since we're using locomotive scroll
        pixelRatio: Math.min(1.5, window.devicePixelRatio) // limit pixel ratio for performance
    });
    const textureLoader = new TextureLoader(curtains);
    // load an image with the loader
    const dispImage = new Image();
    dispImage.crossOrigin = "anonymous";
    dispImage.src = window.location.href.match(/localhost/) ?  "./assets/images/displacement-ready.jpg" : "/wp-content/themes/central-park/assets/images/displacement-ready.jpg";
    let newTexture = new Texture(curtains, {
        // set premultiplyAlpha to true, minFilter, anisotropy and use half-floating point texture
        sampler: "uTexture",
        premultiplyAlpha: true,
        minFilter: curtains.gl.LINEAR_MIPMAP_NEAREST,
        anisotropy: 16,
        floatingPoint: "half-float"
        });
    textureLoader.loadImage(dispImage, {
        // texture options (we're only setting its sampler name here)
        sampler: "uTexture"
        }, (texture) => {
        // texture has been successfully created, you can safely use it
        newTexture = texture;
        }, (image, error) => {
        // there has been an error while loading the image
        });
    curtains.onRender(() => {
        
        // if(useNativeScroll) {
        if(true) {
            // update our planes deformation
            // increase/decrease the effect
            scrollEffect = curtains.lerp(scrollEffect, 0, 0.05);
            planesDeformations / 60;
            planes.forEach(plane => {
                plane.uniforms.displacement.value = (planesDeformations / 60);
            })
            // console.log(planes[0].uniforms.displacement.value);
            // if(Math.abs(delta.y) > Math.abs(planesDeformations)) {
            //     planesDeformations = curtains.lerp(planesDeformations, delta.y, 0.5);
            // }
        }
    }).onScroll(() => {
        // get scroll deltas to apply the effect on scroll
        const delta = curtains.getScrollDeltas();
        planesDeformations = curtains.lerp(planesDeformations, delta.y, 0.5);
        // invert value for the effect
        delta.y = -delta.y;

        // threshold
        if(delta.y > 60) {
            delta.y = 60;
        }
        else if(delta.y < -60) {
            delta.y = -60;
        }

        if(useNativeScroll && Math.abs(delta.y) > Math.abs(scrollEffect)) {
            scrollEffect = curtains.lerp(scrollEffect, delta.y, 0.1);
        }
        else {
            scrollEffect = curtains.lerp(scrollEffect, delta.y * 1, 0.1);
            // console.log(scrollEffect);
        }

        // manually update planes positions
        for(let i = 0; i < planes.length; i++) {
            // apply additional translation, scale and rotation
            applyPlanesParallax(i);

            // update the plane deformation uniform as well
            planes[i].uniforms.scrollEffect.value = scrollEffect;
        }
    }).onError(() => {
        // we will add a class to the document body to display original images
        document.body.classList.add("no-curtains", "planes-loaded");
    }).onContextLost(() => {
        // on context lost, try to restore the context
        curtains.restoreContext();
    });
    
    function updateScroll(xOffset, yOffset) {
        // update our scroll manager values
        curtains.updateScrollValues(xOffset, yOffset);
    }
    
    // custom scroll event
    if(!useNativeScroll) {
        // we'll render only while lerping the scroll
        curtains.disableDrawing();
        smoothScroll.on('scroll', (obj) => {
            updateScroll(obj.scroll.x, obj.scroll.y);

            // render scene
            curtains.needRender();
        });
    }

    // keep track of the number of plane we're currently drawing
    const debugElement = document.getElementById("debug-value");
    // we need to fill the counter with all our planes
    let planeDrawn = planeElements.length;

    const vs = `
        precision mediump float;

        // default mandatory variables
        attribute vec3 aVertexPosition;
        attribute vec2 aTextureCoord;

        uniform mat4 uMVMatrix;
        uniform mat4 uPMatrix;

        uniform mat4 planeTextureMatrix;
        uniform mat4 uTextureMatrix1;

        // custom variables
        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;
        varying vec2 vDispTextureCoord;

        uniform float uPlaneDeformation;

        void main() {

            vec3 vertexPosition = aVertexPosition;

            // cool effect on scroll
            vertexPosition.x += sin(((vertexPosition.x + 1.0) / 2.0) * 3.141592) * (sin(uPlaneDeformation / 180.0));

            gl_Position = uPMatrix * uMVMatrix * vec4(vertexPosition, 1.0);

            // varyings
            vVertexPosition = vertexPosition;
            vTextureCoord = (planeTextureMatrix * vec4(aTextureCoord, 0.0, 1.0)).xy;
            vDispTextureCoord = (uTextureMatrix1 * vec4(aTextureCoord, 0.0, 1.0)).xy;
            
        }
    `;

    const fs = `
    precision mediump float;
        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;
        varying vec2 vDispTextureCoord;
        uniform sampler2D planeTexture;
        uniform sampler2D uSampler1;
    
        uniform float uDisplacement;
        float cutoff = 0.1;
        void main( void ) {
            vec2 textureCoords = vTextureCoord;
            vec2 textureCoords1 = vDispTextureCoord;
            //vec4 displacement = texture2D(planeTexture, textureCoords);
            vec4 displacement1 = texture2D(uSampler1, textureCoords1);
    //
            //// displace along Y axis

            textureCoords.y += displacement1.r * uDisplacement * 0.175;
            // textureCoords.x += displacement1 * uDisplacement;
            vec4 plainTextureToRender = texture2D(planeTexture, textureCoords);
            vec4 textDsp = texture2D(uSampler1, textureCoords1);
            gl_FragColor = plainTextureToRender;
        }
    `;
    const params = {
        vertexShader: vs,
        fragmentShader: fs,
        widthSegments: 10,
        heightSegments: 10,
        uniforms: {
            displacement: {
                name: "uDisplacement",
                type: "1f",
                value: 0,
            },
            planeDeformation: {
                name: "uPlaneDeformation",
                type: "1f",
                value: 0,
            },
            alpha: {
                name: "alpha",
                value: 0,
                type: '1f'
            },
            
            scrollEffect: {
                name: "uScrollEffect",
                type: "1f",
                value: 0,
            },
        },
    };

    // add our planes and handle them
    for(let i = 0; i < planeElements.length; i++) {
        const plane = new Plane(curtains, planeElements[i], params);
        
        planes.push(plane);
        plane.textures[0].scale = new Vec3(1.2,1.2,1.2);
        plane.loadImage(dispImage);
        console.log(plane);
        handlePlanes(i);
    }
    const colors = [
        'red',
        'green',
        'blue',
    ]
    planes.forEach((plane, index) => {
        
        
        plane.onError(() => {
            console.log("plane error", plane);
        }).onReady(() => {
            // once everything is ready, display everything
            if(index === planes.length - 1) {
                document.body.classList.add("planes-loaded");
            }
        }).onRender(() => {
            // update the uniform
            plane.uniforms.planeDeformation.value = planesDeformations / 10;
        });
        ScrollTrigger.create({
            trigger: plane.htmlElement,
            // markers: true,
            onEnter: () => {
                
            },
            onEnterBack: () => {
            },
            onUpdate: (self) => {
                gsap.to(plane.uniforms.alpha, { value: Math.min(0.5 + self.progress, 1) });
                gsap.to(plane.htmlElement.parentElement.querySelector('h2'), { scale: 1 + self.progress })
                // plane.uniforms.alpha.value = 0.8 + self.progress;
                // plane.textures[0].setOffset(new Vec2(0, self.progress * 0.1))
                gsap.to(plane.textures[0].offset, { y: self.progress * 0.15 })
                // gsap.utils.interpolate(plane.textures[0].offset.y ,self.progress,0.1)
                // plane.textures[0].setOffset(new Vec2(0, self.progress))
            }
        })
    })

    // handle all the planes
    function handlePlanes(index) {
        const plane = planes[index];

        // check if our plane is defined and use it
        plane.onReady(() => {
            // apply parallax on load
            applyPlanesParallax(index);

            // once everything is ready, display everything
            if(index === planes.length - 1) {
                document.body.classList.add("planes-loaded");
            }
        }).onAfterResize(() => {
            // apply new parallax values after resize
            applyPlanesParallax(index);
        }).onRender((e) => {
            // new way: we just have to change the rotation and scale properties directly!
            // apply the rotation
            // plane.rotation.z = Math.abs(scrollEffect) / 1500;

            // scale plane and its texture
            // plane.scale.y = 1 + Math.abs(scrollEffect) / 600;
            // plane.textures[0].scale.y = 1 + Math.abs(scrollEffect) / 300;

            // plane.relativeTranslation.y = 5
            // console.log(scrollEffect);

            /*
            // old way: using setRotation and setScale
            plane.setRotation(new Vec3(0, 0, scrollEffect / 750));
            plane.setScale(new Vec2(1, 1 + Math.abs(scrollEffect) / 300));
            plane.textures[0].setScale(new Vec2(1, 1 + Math.abs(scrollEffect) / 150));
            */
        }).onReEnterView(() => {
            // plane is drawn again
            planeDrawn++;
            // update our number of planes drawn debug value
            // debugElement.innerText = planeDrawn;
        }).onLeaveView(() => {
            // plane is not drawn anymore
            planeDrawn--;
            // update our number of planes drawn debug value
            // debugElement.innerText = planeDrawn;
        });
    }

    function applyPlanesParallax(index) {
        // calculate the parallax effect

        // get our window size
        const sceneBoundingRect = curtains.getBoundingRect();
        // get our plane center coordinate
        const planeBoundingRect = planes[index].getBoundingRect();
        const planeOffsetTop = planeBoundingRect.top + planeBoundingRect.height / 2;
        // get a float value based on window height (0 means the plane is centered)
        const parallaxEffect = (planeOffsetTop - sceneBoundingRect.height / 2) / sceneBoundingRect.height;

        // apply the parallax effect
        // planes[index].relativeTranslation.y = parallaxEffect * sceneBoundingRect.height / 4;

        /*
        // old way using setRelativeTranslation
        planes[index].setRelativeTranslation(new Vec3(0, parallaxEffect * (sceneBoundingRect.height / 4)));
         */
    }

    const shaderPassFs = `
        precision mediump float;
        varying vec3 vVertexPosition;
        varying vec2 vTextureCoord;
        uniform sampler2D uRenderTexture;
        uniform sampler2D displacementTexture;
    
        uniform float uDisplacement;
    
        void main( void ) {
            vec2 textureCoords = vTextureCoord;
            vec4 displacement = texture2D(displacementTexture, textureCoords);
    
            // displace along Y axis
           //textureCoords.y += (sin(displacement.r * 1000.0) / 150.0) * uDisplacement;
           //textureCoords.x += (sin(displacement.r * 1000.0) / 200.0) * uDisplacement;

            gl_FragColor = texture2D(uRenderTexture, textureCoords);
        }
    `;

    const shaderPassParams = {
        fragmentShader: shaderPassFs, // we'll be using the lib default vertex shader
        uniforms: {
            displacement: {
                name: "uDisplacement",
                type: "1f",
                value: 0,
            },
            // image: {
            //     name: "uImage",
            //     type: "vec4",
            //     value: null,
            // }
        },

        texturesOptions: {
            anisotropy: 10,
        }
    };
    const shaderPass = new ShaderPass(curtains, shaderPassParams);

    // we will need to load a new image
    const image = new Image();
    image.src = "./assets/images/displacement-ready.png";
    // set its data-sampler attribute to use in fragment shader
    image.setAttribute("data-sampler", "displacementTexture");

    // if our shader pass has been successfully created
    if(shaderPass) {
        // load our displacement image
        shaderPass.loadImage(image);
        shaderPass.onLoading((texture) => {
            console.log(shaderPass);
            console.log("shader pass image has been loaded and texture has been created:", texture);

        }).onReady(() => {
            console.log("shader pass is ready");
        }).onRender(() => {
            // update the uniforms
            shaderPass.uniforms.displacement.value = planesDeformations / 60;
        }).onError(() => {
            console.log('shader pass error');
        });
    }
}