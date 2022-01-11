import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import "https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js"; // REF?

export class Water {
  constructor(scene, initialParams) {
    this.scene = scene;

    this.resolution = 50;
    this.waterParams = initialParams.water;
    this.initialParams = initialParams;
    this.waterPlane;
    this.waterMesh = this.createWaterPlane();
  }

  createWaterPlane() {
    // Add water plane and rotate to be parallel with xz-plane
    this.waterPlane = new THREE.PlaneBufferGeometry(
      200,
      200,
      this.resolution,
      this.resolution
    ).rotateX(-Math.PI / 2);

    this.waterPlane.computeVertexNormals();
    const groundMaterial = new THREE.MeshPhongMaterial({
      color: 0x347deb,
      opacity: 0.95,
      flatShading: this.waterParams.flatShading,
      transparent: true,
    });

    const waterMesh = new THREE.Mesh(this.waterPlane, groundMaterial);
    this.scene.add(waterMesh);
    return waterMesh;
  }

  generateWaterMovement() {
    const { array } = this.waterPlane.attributes.position;
    const now = Date.now() / 1000;
    for (let i = 0; i < array.length; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];

      const xsin = Math.sin(x + now);
      const zcos = Math.cos(z + now);

      array[i + 1] =
        this.initialParams.plane.noise !== "simplex"
          ? 2.0 + xsin * zcos
          : xsin * zcos;
    }
    this.waterPlane.computeVertexNormals(); // calculate new normals
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

  update() {
    this.generateWaterMovement();
  }
}
