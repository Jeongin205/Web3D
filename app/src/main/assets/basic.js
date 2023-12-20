import * as THREE from "three";
import { GLTFLoader } from "GLTFLoader";
import Stats from "Stats";
import { Octree } from "Octree";
import { Capsule } from "Capsule";
import { RGBELoader } from "RGBELoader";
import { FBXLoader } from "FBXLoader";
import { OBJLoader } from "OBJLoader";
import { MTLLoader } from "MTLLoader";

class App {
    _loadModel(){
        Android.test()
    }
    constructor() {
        //앱 초기화
        THREE.Cache.enabled = true;
        const divContainer = document.querySelector("#webgl-container");
        this._divContainer = divContainer;

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        divContainer.appendChild(renderer.domElement);

        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.VSMShadowMap;
        this._renderer = renderer;

        const scene = new THREE.Scene();
        this._scene = scene;

        this._worldOctree = new Octree();
        this._textureLoader = new THREE.TextureLoader();

        this._fbxLoader = new FBXLoader();
        this._fences = new THREE.Object3D();

        this._mtlLoader = new MTLLoader();
        this._objLoader = new OBJLoader();
        this._trees = new THREE.Object3D();

        this._scene.add(this._fences);
        this._scene.add(this._trees);



        this._setupCamera();
        this._setupLight();
        this._setupModel();
        this._setupControls();
        this._setupBackground();

        window.onresize = this.resize.bind(this);
        this.resize();

        requestAnimationFrame(this.render.bind(this));
    }

    _setupControls() {
        // fps 상태를 알려주는 코드
        const stats = new Stats();
        this._divContainer.appendChild(stats.dom);
        this._fps = stats;
    }

 
    _setupBackground() {
        // 배경을 설정해주는 함수
        new RGBELoader().load(
            "./backGround.hdr",
            (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                this._scene.background = texture; // 3차원 배경으로 사용
                this._scene.environment = texture; // 광원으로 사용
            }
        );
    }



    _setupModel() {
        //캐릭터 모델을 불러오는 코드
        const gLoader = new GLTFLoader();
        gLoader.load("./clicker.gltf", (gltf) => {
            const model = gltf.scene;
            this._scene.add(model);
            // model.traverse((child) => {
            //     if (child instanceof THREE.Mesh) {
            //         // 그림자 표시
            //         child.castShadow = true;
            //     }
            // });
            console.log(model)
            model.position.set(0,0,0)
            this._model = model;
        })
    }

    _setupCamera() {
        // 카메라(시점)을 설정해주는 함수
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            100
        );

        camera.position.set(0, 0, 2);
        this._camera = camera;
    }

    _addPointLight(x, y, z) {
        // 포인트 빛을 만들어주는 함수
        const color = 0xffffff;
        const intensity = 1.5;

        const pointLight = new THREE.PointLight(color, intensity, 1000);
        pointLight.position.set(x, y, z);

        this._scene.add(pointLight);
    }

    _setupLight() {
        // 빛을 설정하는 함수
        // 전체를 밝혀주는 빛 코드
        // const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        // this._scene.add(ambientLight);

        // // 설정한 포인트를 밝혀주는 빛 코드
        // this._addPointLight(800, 1000, 800);
        // this._addPointLight(-800, 1000, 800);
        // this._addPointLight(-800, 1000, -800);
        // this._addPointLight(800, 1000, -800);
        // this._addPointLight(0, 1000, 0);

        // // 그림자를 만들기 위한 빛 코드
        // const shadowLight = new THREE.DirectionalLight(0xffffff, 0.2);
        // shadowLight.position.set(200, 500, 200);
        // shadowLight.target.position.set(0, 0, 0);

        // this._scene.add(shadowLight);
        // this._scene.add(shadowLight.target);

        //     // 그림자 표시
        // shadowLight.castShadow = true;
        // shadowLight.shadow.mapSize.width = 1024;
        // shadowLight.shadow.mapSize.height = 1024;
        // shadowLight.shadow.camera.top = shadowLight.shadow.camera.right = 700;
        // shadowLight.shadow.camera.bottom = shadowLight.shadow.camera.left = -700;
        // shadowLight.shadow.camera.near = 100;
        // shadowLight.shadow.camera.far = 900;
        // shadowLight.shadow.radius = 5;
    }


    _previousDirectionOffset = 0;

    _speed = 0;
    _maxSpeed = 0;
    _acceleration = 0;

    _bOnTheGround = false;
    _fallingAcceleration = 0;
    _fallingSpeed = 0;

    update(time) {
        //프레임마다 업데이트해주는 함수
        time *= 0.001; // second unit


        this._fps.update();
        this._previousTime = time;
    }

    render(time) {
        // 렌더링해주는 함수
        this._renderer.render(this._scene, this._camera);
        this.update(time);

        requestAnimationFrame(this.render.bind(this));
    }

    resize() {
        // 창의 사이즈가 바뀌었을때 반응하는 함수
        const width = this._divContainer.clientWidth;
        const height = this._divContainer.clientHeight;

        this._camera.aspect = width / height;
        this._camera.updateProjectionMatrix();

        this._renderer.setSize(width, height);
    }
}

window.onload = function () {
    new App();
};
