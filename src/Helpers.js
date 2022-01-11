import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { VertexNormalsHelper } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/helpers/VertexNormalsHelper.js";

export class Helpers {
  constructor(scene, light, planeMesh) {
    this.light = light;
    this.scene = scene;
    this.planeMesh = planeMesh;
    this.axesHelper();
  }

  lightHelpers() {
    const lightHelper = new THREE.PointLightHelper(this.light);
    this.scene.add(lightHelper);
  }

  axesHelper(show) {
    const axesHelper = new THREE.AxesHelper(200);
    axesHelper.name = "axesHelper";
    if (show) {
      this.scene.add(axesHelper);
    } else {
      this.scene.remove(this.scene.getObjectByName("axesHelper"));
    }
  }

  vertexNormalsHelper(show) {
    console.log(show);
    const vertexHelper = new VertexNormalsHelper(
      this.planeMesh,
      2,
      0x00ff00,
      1
    );
    vertexHelper.name = "vertexHelper";
    if (show) {
      this.scene.add(vertexHelper);
    } else {
      this.scene.remove(this.scene.getObjectByName("vertexHelper"));
    }
  }
}
