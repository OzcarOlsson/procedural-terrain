import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import "https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js"; // REF?

export class World {
  constructor(scene, terrainSize, resolution, initialParams) {
    this.scene = scene;
    this.terrainSize = terrainSize;
    this.resolution = resolution;
    this.planeMesh = this.createPlane(initialParams.plane);
    this.setupLight();
    // this.createPlane();
  }

  getPlaneMesh() {
    return this.planeMesh;
  }

  removeMesh() {
    const object = this.scene.getObjectByProperty("uuid", this.planeMesh.uuid);
    if (object) {
      object.geometry.dispose();
      object.material.dispose();
      this.scene.remove(object);
    }
  }

  createPlane(planeParams) {
    const planeGeometry = new THREE.PlaneBufferGeometry(
      this.terrainSize,
      this.terrainSize,
      this.resolution,
      this.resolution
    ).rotateX(-Math.PI / 2);
    this.generateTerrain(planeGeometry, planeParams);
    planeGeometry.computeVertexNormals();
    const material = new THREE.MeshStandardMaterial({
      color: "gray",
      // map: snowTex,
      // displacementMap: height,
      // wireframe: true,
    });
    const planeMesh = new THREE.Mesh(planeGeometry, material);
    this.scene.add(planeMesh);
    this.planeMesh = planeMesh;
    return planeMesh;
  }
  generateTerrain(planeGeometry, planeParams) {
    const { array } = planeGeometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];

      const xz = new THREE.Vector2(x, z);
      const origo = new THREE.Vector2(0, 0);
      // calc distance to center
      let dist = xz.distanceTo(origo);

      array[i + 1] = this.generateNoise(x, z, planeParams, i);
    }
  }

  generateNoise(x, z, planeParams, i) {
    // Paramaters
    // i < 10 && console.log("nois", planeParams.scale);
    const scale = planeParams.scale;
    const persistence = planeParams.persistence;
    const octaves = planeParams.octaves;
    const lacunarity = planeParams.lacunarity;
    const exponentation = planeParams.exponentation;
    const height = planeParams.height;

    const simplex = new SimplexNoise();

    // actual noise
    const xs = x / scale;
    const zs = z / scale;
    const G = 2.0 ** -persistence;
    let amplitude = 1.0;
    let frequency = 1.0;
    let normalization = 0;
    let total = 0;
    for (let i = 0; i < octaves; i++) {
      const noiseValue =
        simplex.noise2D(xs * frequency, zs * frequency) * 0.5 + 0.5;
      total += noiseValue * amplitude;
      normalization += amplitude;
      amplitude *= G;
      frequency *= lacunarity;
    }
    total /= normalization;

    return Math.pow(total, exponentation) * height;
  }

  setupLight() {
    let lightPosition = new THREE.Vector3(2.0, 5.0, 5.0);

    let light = new THREE.PointLight("#fff", 1, 500);
    light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
    // light.castShadow = true;
    this.scene.add(light);

    const lightHelper = new THREE.PointLightHelper(light);
    this.scene.add(lightHelper);
  }
}
