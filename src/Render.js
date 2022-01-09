import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";

import { Water } from "./Water.js";
import { GUI } from "./GUI.js";
import { World } from "./World.js";
export class Render {
  constructor(initialParams) {
    this.scene = new THREE.Scene();
    this.camera = this.setupCamera();

    this.terrainSize = 100;
    this.resolution = 50;
    this.world = new World(
      this.scene,
      this.terrainSize,
      this.resolution,
      initialParams
    );
    new GUI(initialParams, this.world);
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(innerWidth, innerHeight);
    this.renderer.setPixelRatio(devicePixelRatio);
    document.body.appendChild(this.renderer.domElement);

    this.controls = this.setupControls();
    this.controls.update();
    this.animate = this.animate.bind(this);
    this.resize = this.resize.bind(this);
    window.addEventListener("resize", this.resize);

    this.water = new Water(this.scene, this.terrainSize, this.resolution);
    this.time = Date.now();
    this.animate();
  }

  setupCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      innerWidth / innerHeight,
      0.1,
      1000
    );
    camera.position.z = 20;
    camera.position.y = 8;
    camera.position.x = 8;

    return camera;
  }

  setupControls() {
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    controls.addEventListener("change", () => {
      this.renderer.render(this.scene, this.camera);
    });
    return controls;
  }

  animate() {
    requestAnimationFrame(this.animate);

    let now = Date.now();
    let dt = now - this.time;

    // console.log(dt);
    // if (dt > 200) {
    this.water.update(dt);
    this.time = now;
    // }
    this.renderer.render(this.scene, this.camera);
  }

  resize(event) {
    this.camera.aspect = event.target.innerWidth / event.target.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(event.target.innerWidth, event.target.innerHeight);
  }
}
