import "./style.css";
import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";
import { VertexNormalsHelper } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/helpers/VertexNormalsHelper.js";

const scene = new THREE.Scene();

console.log(scene);
console.log(OrbitControls);

// Load
const fileLoader = new THREE.FileLoader();
let shaders = 2;
let planeVertexShader, planeFragmentShader;
loadFiles();
function loadFiles() {
  fileLoader.load("./shaders/planeVert.glsl", (data) => {
    planeVertexShader = data;
    loaded();
  });

  fileLoader.load("./shaders/planeFrag.glsl", (d) => {
    planeFragmentShader = d;
    loaded();
  });

  return { planeVertexShader, planeFragmentShader };
}

function loaded() {
  shaders--;
  if (shaders === 0) {
    init();
  }
}

function init() {
  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  // ORBIT
  const controls = new OrbitControls(camera, renderer.domElement);
  console.log(controls);
  controls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });
  controls.update();

  // LIGHT
  // const ambientLight = new THREE.AmbientLight("#fff", 1.0);
  // scene.add(ambientLight);
  const lightPosition = new THREE.Vector3(2.5, 6.5, 1.0);
  var light = new THREE.PointLight("#fff", 1, 100);
  light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
  // light.castShadow = true;
  scene.add(light);
  console.log(light);
  const lightHelper = new THREE.PointLightHelper(light);
  scene.add(lightHelper);
  // const hemLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  // scene.add(hemLight);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const planeGeometry = new THREE.PlaneBufferGeometry(30, 30, 25, 25);

  // Make Terrain
  makeTerrain(planeGeometry);

  const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });
  const material = new THREE.ShaderMaterial({
    // wireframe: true,

    uniforms: {
      time: { value: 1.0 },
      Ka: { value: new THREE.Vector3(0.9, 0.5, 0.3) },
      Kd: { value: new THREE.Vector3(0.9, 0.5, 0.3) },
      Ks: { value: new THREE.Vector3(0.8, 0.8, 0.8) },
      LightIntensity: { value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
      LightPosition: {
        value: new THREE.Vector4(
          lightPosition.x,
          lightPosition.y,
          lightPosition.z,
          1.0
        ),
      },
      Shininess: { value: 200.0 },
    },
    vertexShader: planeVertexShader,
    fragmentShader: planeFragmentShader,
    side: THREE.DoubleSide,
  });
  // planeGeometry.computeVertexNormals();
  const planeMesh = new THREE.Mesh(planeGeometry, material);
  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);

  // AXES helpers
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  scene.add(mesh);
  scene.add(planeMesh);

  mesh.position.y = 5;

  camera.position.z = 30;
  camera.position.y = 10;
  camera.rotation.x = -Math.PI / 8;
  planeMesh.rotation.x = -Math.PI / 2;
  // plane.translate(0, 0, -2);
  planeGeometry.computeVertexNormals();
  const vertexHelper = new VertexNormalsHelper(planeMesh, 2, 0x00ff00, 1);
  // scene.add(vertexHelper);
  // vertexHelper.update();

  renderer.render(scene, camera);
  // animate(scene, camera, controls, renderer);
}

function makeTerrain(planeGeometry) {
  const planePos = planeGeometry.attributes.position;
  const count = planePos.count;
  console.log(planeGeometry);
  for (let i = 0; i < count; i++) {
    const x = planePos.getX(i);
    const y = planePos.getY(i);
    const z = planePos.getZ(i);
    const texCord = new THREE.Vector2(x, y);
    planePos.setZ(i, z + 2.0 * random(texCord) + Math.sin(fbm(texCord)));
  }
}

function mix(a, b, t) {
  return (1 - t) * a + t * b;
}

function random(st) {
  let r = new THREE.Vector2(12.9898, 78.233);
  return Math.sin(st.dot(r) * 43758.5453123) % 1;
}

// @TODO refactor? lot of variables
function noise(s, t) {
  let i = new THREE.Vector2(Math.floor(s), Math.floor(t));
  let f = new THREE.Vector2(s % 1, t % 1);

  let a = random(i);
  let b = random(i.add(new THREE.Vector2(1.0, 0.0)));
  let c = random(i.add(new THREE.Vector2(0.0, 1.0)));
  let d = random(i.add(new THREE.Vector2(1.0, 1.0)));

  let p = f.multiply(f);
  let q = new THREE.Vector2(3.0 - 2.0 * f.x, 3.0 - 2.0 * f.y);
  let u = p.multiply(q);
  // let u = new THREE.Vector2(f * f * (3.0 - 2.0 * f));

  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

function fbm(st) {
  let value = 0.0;
  let amplitude = 0.5;
  let frequency = 0.0;

  for (let i = 0; i < 8; i++) {
    value += amplitude * noise(st.x, st.y);
    st = new THREE.Vector2(st.x * 2.0, st.y * 2.0);
    amplitude *= 0.5;
  }
  return value;
}
