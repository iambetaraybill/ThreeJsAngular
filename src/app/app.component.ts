import { Component, HostListener, OnInit } from '@angular/core';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
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

  //Mesh
  // geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
  // material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 'yellow' });
  // mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap> = new THREE.Mesh(this.geometry, this.material);
  //******** Here i used sample skull mesh ******************

  //Camera
  aspect: { width: number, height: number } = { width: window.innerWidth, height: window.innerHeight };
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(80, this.aspect.width / this.aspect.height);

  //Renderer
  canvas?: HTMLCanvasElement | THREE.OffscreenCanvas = undefined;
  renderer?: THREE.WebGLRenderer = undefined;

  //Clock
  clock: THREE.Clock = new THREE.Clock();

  //Loader
  loader = new OBJLoader();

  //Lights
  ambientLight = new THREE.AmbientLight(0xffffff);
  directionalLight = new THREE.DirectionalLight(0xffffff);

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

  initCanvasRenderer() {
    this.canvas = document.getElementsByClassName('draw')[0];
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    this.renderer?.setSize(this.aspect.width, this.aspect.height);
    this.renderer?.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
  addLights() {
    this.directionalLight.position.z = 2;
    this.scene.add(this.ambientLight, this.directionalLight);
  }
  addElementsToScene() {

    this.loader.load("../assets/models/skull.obj", (obj: any) => {
      obj.position.x = -1.5;
      obj.position.y = 0;
      obj.position.z = 0;
      obj.rotation.y = 1.5;
      obj.children[0].material = new THREE.MeshNormalMaterial();
      obj.children[1].material = new THREE.MeshNormalMaterial();
      this.scene.add(obj);
    });
    this.scene.add(this.camera);
    this.camera.position.z = 2;
  }
  renderAnimation() {
    // this.mesh.rotation.x = -this.clock.getElapsedTime();
    this.renderer?.render(this.scene, this.camera);
    window.requestAnimationFrame(this.renderAnimation.bind(this));
  }

}
