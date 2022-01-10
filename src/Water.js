import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import "https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js"; // REF?
import { VertexNormalsHelper } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/helpers/VertexNormalsHelper.js";

import { loadTexture } from "./loaders.js";
export class Water {
  constructor(scene, terrainSize, resolution, initialParams) {
    this.scene = scene;
    this.terrainSize = terrainSize;
    // this.resolution = 25;
    this.waterParams = initialParams.water;
    this.resolution = this.waterParams.segments;
    this.waterPlane;
    this.waterTex = loadTexture("../textures/water3.png");
    this.waterMesh = this.createWaterPlane();
  }

  createWaterPlane() {
    // Add groundZero plane
    console.log("asd", this.waterParams.flatShading);
    console.log("asda", this.resolution);
    this.waterPlane = new THREE.PlaneBufferGeometry(
      100,
      100,
      this.resolution,
      this.resolution
    ).rotateX(-Math.PI / 2);

    // console.log("groundPlane", groundPlane);

    // this.generateWaterMovement();
    this.waterPlane.computeVertexNormals();
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0x347deb,
      // roughness: 0.5,
      opacity: 0.85,
      flatShading: this.waterParams.flatShading,
      // transparent: true,
      // map: this.waterTex,
    });

    const waterMesh = new THREE.Mesh(this.waterPlane, groundMaterial);
    this.scene.add(waterMesh);
    return waterMesh;
    // groundMesh.translate(0, 0, 0);
  }

  generateWaterMovement(dt) {
    const { array } = this.waterPlane.attributes.position;
    const now = Date.now() / 2000;
    for (let i = 0; i < array.length; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];

      const xz = new THREE.Vector2(x, z);
      const origo = new THREE.Vector2(0, 0);
      // calc distance to center
      let dist = xz.distanceTo(origo);
      const simplex = new SimplexNoise();

      const xsin = Math.sin(x + now);
      const zcos = Math.cos(z + now);
      const noise = simplex.noise2D(x, z);
      // if (dist <= 10.0) {
      //   array[i + 1] = 0.5 * zcos * Math.sin(now * Math.PI);
      // } else {
      //   array[i + 1] = -3.0;
      // }
      // array[i + 1] = 0.5 * zcos * Math.sin(now * Math.PI);
      array[i + 1] = -0.5 + xsin * zcos;
    }
    this.waterPlane.computeVertexNormals();
    this.waterPlane.attributes.position.needsUpdate = true;
    // const vertexHelper = new VertexNormalsHelper(
    //   this.waterMesh,
    //   2,
    //   0x00ff00,
    //   1
    // );
    // this.scene.add(vertexHelper);
  }

  changeWaterParams(waterParams) {
    this.waterParams = waterParams;
    this.waterMesh.material = new THREE.MeshPhongMaterial({
      color: 0x347deb,
      // roughness: 0.5,
      opacity: 0.85,
      flatShading: this.waterParams.flatShading,
      // transparent: true,
      // map: this.waterTex,
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
