import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

export class Helpers {
  constructor(scene, light) {
    this.light = light;
    this.scene = scene;

    this.lightHelpers();
    this.axesHelper();
  }

  lightHelpers() {
    const lightHelper = new THREE.PointLightHelper(this.light);
    this.scene.add(lightHelper);
  }

  axesHelper() {
    const axesHelper = new THREE.AxesHelper(20);
    this.scene.add(axesHelper);
  }
}
