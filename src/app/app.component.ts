import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import * as THREE from 'three';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  //Scene
  scene: THREE.Scene = new THREE.Scene();

  //Mesh
  geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
  material: THREE.MeshBasicMaterial = new THREE.MeshBasicMaterial({ color: 'yellow' });
  mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap> = new THREE.Mesh(this.geometry, this.material);

  //Camera
  aspect: { width: number, height: number } = { width: window.innerWidth, height: window.innerHeight };
  camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(80, this.aspect.width / this.aspect.height);

  //Renderer
  canvas?: HTMLCanvasElement | THREE.OffscreenCanvas = undefined;
  renderer?: THREE.WebGLRenderer = undefined;

  //Clock
  clock: THREE.Clock = new THREE.Clock();

  //const loader = new OBJLoader();

  ngOnInit(): void {
    this.initCanvasRenderer();
    this.addElementsToScene();
    this.renderAnimation();
  }
  initCanvasRenderer() {
    this.canvas = document.getElementsByClassName('draw')[0];
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas })
    this.renderer?.setSize(this.aspect.width, this.aspect.height);
  }
  addElementsToScene() {
    this.scene.add(this.mesh);
    this.scene.add(this.camera);
    this.camera.position.z = 2;
  }
  renderAnimation() {
    this.mesh.rotation.x = this.clock.getElapsedTime();
    this.renderer?.render(this.scene, this.camera);
    window.requestAnimationFrame(this.renderAnimation.bind(this));
  }
}
