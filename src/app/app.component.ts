import { Component, HostListener, OnInit } from '@angular/core';
import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { SharedModule } from './shared.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  //Scene
  scene: THREE.Scene = new THREE.Scene();
  //Mesh ******** Here i used neymar ******************

  // group?: THREE.Group;

  //Camera
  aspect: { width: number, height: number } = { width: window.innerWidth, height: window.innerHeight };
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(85, this.aspect.width / this.aspect.height);

  //Renderer
  canvas?: HTMLCanvasElement | THREE.OffscreenCanvas;
  renderer?: THREE.WebGLRenderer;

  //Clock
  clock: THREE.Clock = new THREE.Clock();

  //Loader
  loader = new FBXLoader();
  // textureLoader = new THREE.TextureLoader();

  //Lights
  ambientLight = new THREE.AmbientLight(0xffffff);
  directionalLight = new THREE.DirectionalLight(0xffffff);

  //Orbit Controls
  controls?: OrbitControls;
  mixer? : any;
  clipAction? : any;
  // cursor
  // cursor: { x: number, y: number } = { x: 0, y: 0 };

  ngOnInit(): void {
    this.initCanvasRenderer();
    this.addLights();
    this.addElementsToScene();
    this.renderAnimation();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    //change aspect 
    this.aspect.width = window.innerWidth;
    this.aspect.height = window.innerHeight;
    //change camera aspect ratio and update projection matrix 
    this.camera.aspect = this.aspect.width / this.aspect.height;
    this.camera.updateProjectionMatrix();
    //update renderer size
    this.renderer?.setSize(this.aspect.width, this.aspect.height);
    this.renderer?.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  // @HostListener('window:mousemove', ['$event'])
  // onMousemove(event: any) {
  //   //change aspect 
  //   this.cursor.x = event.clientX / window.innerWidth - 0.5;
  //   this.cursor.y = event.clientY / window.innerHeight - 0.5;
  // }
  initCanvasRenderer() {
    this.canvas = document.getElementsByClassName('draw')[0];
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    this.renderer?.setSize(this.aspect.width, this.aspect.height);
    this.renderer?.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableRotate = false;
    this.controls.enableZoom = false;
  }
  addLights() {
    this.directionalLight.position.z = 2;
    this.scene.add(this.ambientLight, this.directionalLight);
  }
  addElementsToScene() {
    this.loader.load("../assets/models/sambaDancing.fbx", (obj: any) => {
      const helper = new THREE.CameraHelper(this.camera);
      this.scene.add(this.camera);
      // this.scene.add(helper);
      this.camera.position.x = obj?.position.x ?? 0;
      this.camera.position.y = obj?.position.y ?? 0;
      this.camera.position.z = obj?.position.z ?? 0;
      this.camera.position.z = 1.9;
      this.camera.position.y = 0.4;
      this.mixer = new THREE.AnimationMixer( obj );
      this.clipAction = this.mixer?.clipAction(obj.animations[0]);
      this.clipAction?.play();
      this.scene.add(obj);
      console.log(obj)
      obj?.position.setY(-1)
    });
  }
  renderAnimation() {
    this.controls?.update();
    this.mixer?.update(this.clock.getDelta());
    this.renderer?.render(this.scene, this.camera);
    window.requestAnimationFrame(this.renderAnimation.bind(this));
  }

}
