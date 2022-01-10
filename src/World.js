import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import "https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js"; // REF?
import { Helpers } from "./Helpers.js";

import { VertexNormalsHelper } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/helpers/VertexNormalsHelper.js";

import { loadTexture } from "./loaders.js";

export class World {
  constructor(scene, terrainSize, resolution, initialParams, shaders) {
    this.scene = scene;
    this.terrainSize = terrainSize;
    this.resolution = resolution;
    this.shaders = shaders;

    this.snowTex = loadTexture("../textures/snow2.jpg");
    this.rockTex = loadTexture("../textures/rockTex.jpg");
    this.dirtTex = loadTexture("../textures/mountWater.jpg");
    this.planeMesh = this.createPlane(initialParams.plane);
    this.lightPosition = initialParams.sun.position;
    this.light = this.setupLight();
    new Helpers(this.scene, this.light);
    this.createSky();

    this.angle = 0;
    this.quat = new THREE.Quaternion();

    this.sun = this.createSun();
    this.createSphere(); //temp
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
    const material = new THREE.MeshPhongMaterial({
      color: "gray",
      // map: this.rockTex,
      // flatShading: true,
      // displacementMap: height,
      // wireframe: true,
    });
    const customMaterial = new THREE.ShaderMaterial({
      vertexShader: this.shaders.terrainVertexShader,
      fragmentShader: this.shaders.terrainFragmentShader,
    });
    const planeMesh = new THREE.Mesh(planeGeometry, material);
    this.scene.add(planeMesh);
    planeMesh.recieveShadow = true;
    planeGeometry.computeVertexNormals();

    this.planeMesh = planeMesh;
    const vertexHelper = new VertexNormalsHelper(
      this.planeMesh,
      2,
      0x00ff00,
      1
    );
    // this.scene.add(vertexHelper);
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

      if (x <= 2.0 && x >= -2.0) {
        array[i + 1] = -2.0;
      } else {
        array[i + 1] = 2.0 + this.generateNoise(x, z, planeParams);
      }

      // array[i + 1] = 2.0 + this.generateNoise(x, z, planeParams);
    }
  }

  generateNoise(x, z, planeParams) {
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
    // return simplex.noise2D(x, z);
  }

  setupLight() {
    // let lightPosition = new THREE.Vector3(2.0, 5.0, 5.0);
    //this.lightPosition = new THREE.Vector3(20.0, 30.0, -20.0);

    let light = new THREE.DirectionalLight("#fff", 1, 500);
    light.position.set(
      this.lightPosition.x,
      this.lightPosition.y,
      this.lightPosition.z
    );

    // light.castShadow = true;
    // const ambientLight = new THREE.AmbientLight("#fff", 1.0);
    // this.scene.add(ambientLight);
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
    const sphereGeometry = new THREE.SphereGeometry(2, 32, 16);
    // const sphereMaterial = new THREE.ShaderMaterial({
    //   vertexShader: sunVertShader,
    //   fragmentShader: sunFragShader,
    // });
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xf9d71c });

    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(sphereMesh);
    sphereMesh.position.set(
      this.lightPosition.x,
      this.lightPosition.y,
      this.lightPosition.z
    );
    return sphereMesh;
  }

  createSphere() {
    const sphereGeometry = new THREE.SphereGeometry(5, 32, 16);
    // const sphereMaterial = new THREE.ShaderMaterial({
    //   vertexShader: sunVertShader,
    //   fragmentShader: sunFragShader,
    // });
    const sphereMaterial = new THREE.MeshStandardMaterial({
      color: "red",
      castShadow: true,
    });

    const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    this.scene.add(sphereMesh);
    sphereMesh.position.set(2, 15, 2);
  }
  updateSunPosition(lightPos) {
    const axis = new THREE.Vector3(1, 0, 0).normalize();
    const l = new THREE.Vector3(lightPos.x, lightPos.y, lightPos.z);

    this.angle += 0.01;
    this.quat.setFromAxisAngle(axis, this.angle);
    l.applyQuaternion(this.quat);

    this.sun.position.set(l.x, l.y, l.z);
    this.light.position.set(l.x, l.y, l.z);

    // this.light.position.set(lightPos.x, lightPos.y, lightPos.z);
  }
}
