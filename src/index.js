import { Render } from "./Render.js";
import "../style.css";

// Init Program
(() => {
  const initialParams = {
    plane: {
      width: 10,
      scale: 4,
      persistence: 0.5,
      lacunarity: 2,
      exponentation: 3.7,
      height: 4,
      octaves: 1,
    },
    sun: {
      position: { x: 20, y: 50, z: 0 },
    },
  };

  new Render(initialParams);
})();
