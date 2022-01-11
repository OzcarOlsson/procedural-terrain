import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import "https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js"; // REF?
import { VertexNormalsHelper } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/helpers/VertexNormalsHelper.js";

import { loadTexture } from "./loaders.js";
export class Water {
  constructor(scene, initialParams) {
    this.scene = scene;

    this.resolution = 50;
    this.waterParams = initialParams.water;

    this.waterPlane;
    this.waterTex = loadTexture("../textures/water3.png");
    this.waterMesh = this.createWaterPlane();
  }

  moveWaterMesh(dist) {
    this.waterMesh.translateOnAxis(new THREE.Vector3(0, 1, 0), dist);
  }
  createWaterPlane() {
    // Add water plane
    this.waterPlane = new THREE.PlaneBufferGeometry(
      200,
      200,
      this.resolution,
      this.resolution
    ).rotateX(-Math.PI / 2);

    this.waterPlane.computeVertexNormals();
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0x347deb,
      opacity: 0.85,
      flatShading: this.waterParams.flatShading,
      transparent: true,
      // map: this.waterTex,
    });

    const waterMesh = new THREE.Mesh(this.waterPlane, groundMaterial);
    this.scene.add(waterMesh);
    return waterMesh;
  }

  generateWaterMovement(dt) {
    const { array } = this.waterPlane.attributes.position;
    const now = Date.now() / 2000;
    for (let i = 0; i < array.length; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];

      const xsin = Math.sin(x + now);
      const zcos = Math.cos(z + now);

      array[i + 1] = 2.0 + xsin * zcos;
    }
    this.waterPlane.computeVertexNormals();
    this.waterPlane.attributes.position.needsUpdate = true;
  }

  changeWaterParams(waterParams) {
    this.waterParams = waterParams;
    this.waterMesh.material = new THREE.MeshPhongMaterial({
      color: 0x347deb,
      opacity: 0.85,
      flatShading: this.waterParams.flatShading,
      transparent: true,
    });
  }

  removeMesh() {
    const object = this.scene.getObjectByProperty("uuid", this.waterMesh.uuid);
    if (object) {
      object.geometry.dispose();
      object.material.dispose();
      this.scene.remove(object);
    }
  }

  update(dt) {
    // this.removeMesh();
    this.generateWaterMovement(dt);
  }
}
