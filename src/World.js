import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

import perlin from "https://cdn.jsdelivr.net/gh/mikechambers/es6-perlin-module@master/perlin.js";
import { Helpers } from "./Helpers.js";
export class World {
  constructor(scene, terrainSize, resolution, initialParams, shaders) {
    this.scene = scene;
    this.terrainSize = terrainSize;
    this.resolution = resolution;
    this.shaders = shaders;

    this.rockTex = this.loadTexture("../textures/rock2.jpg");

    this.lightPosition = initialParams.sun.position;
    this.planeMesh = this.createPlane(initialParams.plane);
    this.light = this.setupLight();
    this.helpers = new Helpers(this.scene, this.light, this.planeMesh);
    this.createSky();

    this.sun = this.createSun();
  }

  getPlaneMesh() {
    return this.planeMesh;
  }
  getTex() {
    return this.rockTex;
  }
  getHelpers() {
    return this.helpers;
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

    const material = this.createMaterial(planeParams);

    const planeMesh = new THREE.Mesh(planeGeometry, material);
    this.scene.add(planeMesh);

    this.planeMesh = planeMesh;
    return planeMesh;
  }

  createMaterial(planeParams) {
    let material;
    if (planeParams.material === "THREE Phong") {
      material = new THREE.MeshPhongMaterial({
        color: planeParams.texture ? "" : "gray",
        map: planeParams.texture ? this.rockTex : "",
      });
    } else {
      material = new THREE.ShaderMaterial({
        uniforms: {
          lightPosition: {
            value: new THREE.Vector4(
              this.lightPosition.x,
              this.lightPosition.y,
              this.lightPosition.z,
              1.0
            ),
          },
          tex: { value: this.rockTex },
          hasTexture: { value: planeParams.texture ? 1.0 : 0.0 },
        },
        vertexShader: this.shaders.terrainVertexShader,
        fragmentShader: this.shaders.terrainFragmentShader,
      });
    }

    return material;
  }
  generateTerrain(planeGeometry, planeParams) {
    const { array } = planeGeometry.attributes.position;
    for (let i = 0; i < array.length; i += 3) {
      const x = array[i];
      const y = array[i + 1];
      const z = array[i + 2];

      // const xz = new THREE.Vector2(x, z);
      // const origo = new THREE.Vector2(0, 0);
      // // calc distance to center
      // let dist = xz.distanceTo(origo);

      if (x <= 2.0 && x >= -2.0) {
        array[i + 1] = -2.0;
      } else {
        array[i + 1] = 2.0 + this.generateNoise(x, z, planeParams);
      }
    }
  }

  generateNoise(x, z, planeParams) {
    // Paramaters

    const scale = planeParams.scale;
    const persistence = planeParams.persistence;
    const octaves = planeParams.octaves;
    const lacunarity = planeParams.lacunarity;
    const exponentation = planeParams.exponentation;
    const height = planeParams.height;

    // FBM
    const xs = x / scale;

    const zs = z / scale;
    const gain = 2.0 ** -persistence;
    let amplitude = 1.0;
    let frequency = 1.0;
    let normalization = 0;
    let total = 0;
    for (let i = 0; i < octaves; i++) {
      const noiseValue = perlin(xs * frequency, zs * frequency);
      total += noiseValue * amplitude;
      normalization += amplitude;
      amplitude *= gain;
      frequency *= lacunarity;
    }
    total /= normalization;

    return Math.pow(total, exponentation) * height;
  }

  setupLight() {
    let light = new THREE.PointLight("#fff", 1, 500);
    light.position.set(
      this.lightPosition.x,
      this.lightPosition.y,
      this.lightPosition.z
    );
    this.scene.add(light);
    return light;
  }

  createSky() {
    const sky = new THREE.Mesh(
      new THREE.SphereBufferGeometry(200, 200, 50),
      new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.DoubleSide })
    );
    this.scene.fog = new THREE.FogExp2(0xffffff, 0.0007);
    this.scene.add(sky);
  }

  createSun() {
    const sphereGeometry = new THREE.SphereGeometry(5, 32, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xf7eab7 });
    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(sphereMesh);
    sphereMesh.position.set(
      this.lightPosition.x,
      this.lightPosition.y,
      this.lightPosition.z
    );
    return sphereMesh;
  }

  updateSunPosition(params) {
    const lightPosition = params.sun.position;
    this.sun.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
    this.light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
  }

  loadTexture(texURL) {
    const texLoader = new THREE.TextureLoader();
    const texture = texLoader.load(texURL);
    return texture;
  }
}
