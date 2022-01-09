import * as THREE from "https://cdn.skypack.dev/three@0.136.0";

export const loadTexture = (texURL) => {
  const texLoader = new THREE.TextureLoader();
  const texture = texLoader.load(texURL);
  return texture;
};
