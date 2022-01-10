import { Render } from "./Render.js";
import "../style.css";
import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

let numberOfShaders = 2;
let terrainVertexShader, terrainFragmentShader;
// Load shaders and then init program
(() => {
  const fileLoader = new THREE.FileLoader();
  fileLoader.load("../shaders/terrainVert.glsl", (data) => {
    terrainVertexShader = data;
    loaded();
    // console.log(d);
  });

  fileLoader.load("../shaders/terrainFrag.glsl", (data) => {
    terrainFragmentShader = data;
    loaded();
  });
})();

function loaded() {
  numberOfShaders--;
  if (numberOfShaders === 0) {
    initProgram();
  }
}

function initProgram() {
  const initialParams = {
    plane: {
      width: 10,
      scale: 4,
      persistence: 0.5,
      lacunarity: 2,
      exponentation: 3.7,
      height: 8,
      octaves: 1,
    },
    sun: {
      position: { x: 20, y: 50, z: -140 },
    },
    water: {
      flatShading: true,
      segments: 25,
    },
  };

  const shaders = { terrainVertexShader, terrainFragmentShader };

  new Render(initialParams, shaders);
}
