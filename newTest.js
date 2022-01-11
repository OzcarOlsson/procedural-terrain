import "./style.css";

import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";
import { VertexNormalsHelper } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/helpers/VertexNormalsHelper.js";
import "https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js"; // REF?

// import { math } from "https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.0.2/math.js";
// console.log(math.add(1, 1));

const scene = new THREE.Scene();

// Texture loader
const texLoader = new THREE.TextureLoader();
const height = texLoader.load("./textures/hMap.jpg");
const snowTex = texLoader.load("./textures/snowTex.jpg");

const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

const camera = new THREE.PerspectiveCamera(
  75,
  innerWidth / innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
camera.position.y = 8;
camera.position.x = 8;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(devicePixelRatio);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener("change", () => {
  renderer.render(scene, camera);
});

controls.update();

const terrainSize = 50;
const resolution = 25;

const planeGeometry = new THREE.PlaneBufferGeometry(
  terrainSize,
  terrainSize,
  resolution,
  resolution
).rotateX(-Math.PI / 2);

// Modify vertex
const planePos = planeGeometry.attributes.position;
const { array } = planeGeometry.attributes.position;
const count = planePos.count;
console.log(array.length / 3);
console.log("planepos array", planePos);

for (let i = 0; i < array.length; i += 3) {
  const x = array[i];
  let y = array[i + 1];
  const z = array[i + 2];
  const xz = new THREE.Vector2(x, z);
  const origo = new THREE.Vector2(0, 0);
  // calc distance to center
  let dist = xz.distanceTo(origo);

  // array[i + 1] = generateNoise(x, z);
}
// planeGeometry.attributes.position.needsUpdate = true;
// planeGeometry.translate(0, -1.5, 0);
planeGeometry.computeVertexNormals();
const material = new THREE.MeshStandardMaterial({
  color: "gray",
  // map: snowTex,
  displacementMap: height,
  // wireframe: true,
});

const mesh = new THREE.Mesh(planeGeometry, material);

scene.add(mesh);

// Light
let lightPosition = new THREE.Vector3(2.0, 5.0, 5.0);

let light = new THREE.PointLight("#fff", 1, 500);
light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
// light.castShadow = true;
scene.add(light);

const lightHelper = new THREE.PointLightHelper(light);
scene.add(lightHelper);
animate();
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Simplex noise
function generateNoise(x, z) {
  // Paramaters
  const scale = 375;
  const persistence = 0.5;
  const octaves = 4;
  const lacunarity = 2;
  const exponentation = 3.7;
  const height = 4;

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
setupGUI();
function setupGUI() {
  const gui = new dat.GUI();
  const world = {
    plane: {
      width: 10,
    },
  };
  gui.add(world.plane, "width", 1, 20).onChange(() => {});
}

function sat(x) {
  return Math.min(Math.max(x, 0.0), 1.0);
}
