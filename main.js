import "./style.css";
import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/controls/OrbitControls.js";
import { VertexNormalsHelper } from "https://cdn.skypack.dev/three@0.136.0/examples/jsm/helpers/VertexNormalsHelper.js";
import perlin from "https://cdn.jsdelivr.net/gh/mikechambers/es6-perlin-module@master/perlin.js";

//Simplex noise
import "https://cdn.jsdelivr.net/npm/simplex-noise@2.4.0/simplex-noise.js";
const scene = new THREE.Scene();
let lightPosition;
// Load
let shaders = 4;
let planeVertexShader, planeFragmentShader, sunVertShader, sunFragShader;
loadFiles();
function loadFiles() {
  const fileLoader = new THREE.FileLoader();
  fileLoader.load("./shaders/planeVert.glsl", (data) => {
    planeVertexShader = data;
    loaded();
  });

  fileLoader.load("./shaders/planeFrag.glsl", (d) => {
    planeFragmentShader = d;
    loaded();
  });

  fileLoader.load("./shaders/sunVert.glsl", (d) => {
    sunVertShader = d;
    loaded();
  });

  fileLoader.load("./shaders/sunFrag.glsl", (d) => {
    sunFragShader = d;
    loaded();
  });
}

function loaded() {
  shaders--;
  if (shaders === 0) {
    init();
  }
}

function init() {
  const camera = setupCamera();
  const renderer = new THREE.WebGLRenderer();

  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  //ORBIT;
  const controls = new OrbitControls(camera, renderer.domElement);
  console.log(controls);
  controls.addEventListener("change", () => {
    renderer.render(scene, camera);
  });

  controls.update();

  // LIGHT
  // const ambientLight = new THREE.AmbientLight("#fff", 1.0);
  // scene.add(ambientLight);
  // const hemLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
  // scene.add(hemLight);
  setupLight();

  // Make Terrain
  makeTerrain(camera);

  createBox();
  // createGroundPlane();
  // createSun();
  createSky();
  // AXES helpers
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  renderer.render(scene, camera);
  // animate(scene, camera, controls, renderer);
}

function setupCamera() {
  const camera = new THREE.PerspectiveCamera(
    75,
    innerWidth / innerHeight,
    0.1,
    1000
  );
  camera.position.z = 1;
  camera.position.y = 8;
  camera.position.x = 8;
  camera.lookAt(0, 0, 0);
  // camera.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI / 8);
  console.log(camera);

  return camera;
}

function setupLight() {
  // lightPosition = new THREE.Vector3(80.0, 20.0, -20.0);
  lightPosition = new THREE.Vector3(2.0, 5.0, 5.0);

  let light = new THREE.PointLight("#fff", 1, 500);
  light.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
  // light.castShadow = true;
  scene.add(light);
  console.log(light);
  const lightHelper = new THREE.PointLightHelper(light);
  scene.add(lightHelper);
}

function createGroundPlane() {
  // Add groundZero plane
  const groundPlane = new THREE.PlaneBufferGeometry(100, 100, 25, 25);

  const groundMaterial = new THREE.MeshPhongMaterial({
    color: 0x347deb,
    opacity: 0.85,
    transparent: true,
  });
  const groundMesh = new THREE.Mesh(groundPlane, groundMaterial);
  scene.add(groundMesh);
  groundMesh.rotation.x = -Math.PI / 2;
  // groundMesh.translate(0, 0, 0);
}

function makeTerrain(camera) {
  const planeGeometry = new THREE.PlaneBufferGeometry(100, 100, 55, 55);

  // Generate terrain
  const planePos = planeGeometry.attributes.position;
  const count = planePos.count;
  console.log(planeGeometry);

  const simplex = new SimplexNoise();
  console.log(simplex);

  for (let i = 0; i < count; i++) {
    const x = planePos.getX(i);
    const y = planePos.getY(i);
    const z = planePos.getZ(i);
    const texCord = new THREE.Vector2(x, y);

    // planePos.setZ(i, z + 4.0 * random(texCord) + perlin(texCord.x, texCord.y));
    planePos.setZ(
      i,
      z + 5.0 * Math.sin(fbm(texCord)) * simplex.noise3D(x, y, z)
    );
  }

  // calculate new normals

  const groundMaterial = new THREE.MeshPhongMaterial({
    color: 0x347deb,
  });

  const planeMesh = new THREE.Mesh(planeGeometry, groundMaterial);

  planeMesh.rotation.x = -Math.PI / 2;
  planeGeometry.computeVertexNormals();
  // const vertexHelper = new VertexNormalsHelper(planeMesh, 2, 0x00ff00, 1);
  // scene.add(vertexHelper);
  const material = new THREE.ShaderMaterial({
    // wireframe: true,
    uniforms: {
      time: { value: 1.0 },
      test: { value: 0.0 },
      Ka: {
        value: new THREE.Vector3(1, 1, 1),
      },
      Kd: {
        value: new THREE.Vector3(1.0, 1.0, 1.0),
      },
      Ks: {
        value: new THREE.Vector3(0.8, 0.8, 0.8),
      },
      LightIntensity: {
        value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0),
      },
      LightPosition: {
        value: new THREE.Vector4(
          lightPosition.x,
          lightPosition.y,
          lightPosition.z,
          1.0
        ),
      },
      view: camera.view,
      Shininess: { value: 30.0 },
    },
    vertexShader: planeVertexShader,
    fragmentShader: planeFragmentShader,
  });
  planeGeometry.computeVertexNormals();

  scene.add(planeMesh);
  planeMesh.material = material;
}

function createSun() {
  const sphereGeometry = new THREE.SphereGeometry(2, 32, 16);
  const sphereMaterial = new THREE.ShaderMaterial({
    vertexShader: sunVertShader,
    fragmentShader: sunFragShader,
  });

  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  scene.add(sphereMesh);
  sphereMesh.position.set(lightPosition.x, lightPosition.y, lightPosition.z);
}

function createSky() {
  const sky = new THREE.Mesh(
    new THREE.SphereBufferGeometry(120, 120, 50),
    new THREE.MeshBasicMaterial({ color: 0x87ceeb, side: THREE.BackSide })
  );
  scene.fog = new THREE.FogExp2(0xffffff, 0.0007);
  // scene.add(sky);
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
  let frequency = 1.0;

  for (let i = 0; i < 8; i++) {
    value += amplitude * frequency * noise(st.x, st.y);
    st = new THREE.Vector2(st.x * 2.0, st.y * 2.0);
    amplitude *= 0.5;
    frequency *= 4.0;
  }
  return value;
}

function createBox() {
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshPhongMaterial({ color: 0x00ff00 });

  // const material = new THREE.ShaderMaterial({
  //   // wireframe: true,

  //   uniforms: {
  //     time: { value: 1.0 },
  //     test: { value: 1.0 },
  //     Ka: {
  //       value: new THREE.Vector3(0.5, 0.5, 0.5),
  //     },
  //     Kd: {
  //       value: new THREE.Vector3(0.5, 0.5, 0.5),
  //     },
  //     Ks: {
  //       value: new THREE.Vector3(0.8, 0.8, 0.8),
  //     },
  //     LightIntensity: {
  //       value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0),
  //     },
  //     // LightPosition: {
  //     //   value: new THREE.Vector4(0.0, 5.0, 0.0, 1.0),
  //     // },
  //     LightPosition: {
  //       value: new THREE.Vector4(
  //         lightPosition.x,
  //         lightPosition.y,
  //         lightPosition.z,
  //         1.0
  //       ),
  //     },
  //     Shininess: { value: 30.0 },
  //   },
  //   vertexShader: planeVertexShader,
  //   fragmentShader: planeFragmentShader,

  //   // side: THREE.DoubleSide,
  // });

  const mesh = new THREE.Mesh(boxGeometry, boxMaterial);
  scene.add(mesh);
  const vertexHelper = new VertexNormalsHelper(mesh, 2, 0x00ff00, 1);

  // scene.add(vertexHelper);

  mesh.position.y = 5;
}
