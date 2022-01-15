export class GUI {
  constructor(initialParams, World, Water) {
    this.initialParams = initialParams;
    this.world = World;
    this.water = Water;
    this.setupGUI();
  }

  setupGUI() {
    const gui = new dat.GUI();

    // Terrain
    const terrainFolder = gui.addFolder("Terrain");
    terrainFolder
      .add(this.initialParams.plane, "material", [
        "custom shader",
        "THREE Phong",
      ])
      .onChange(() => this.updateTerrain());

    terrainFolder
      .add(this.initialParams.plane, "scale", 1, 100)
      .onChange(() => this.updateTerrain());
    terrainFolder
      .add(this.initialParams.plane, "persistence", 0, 4)
      .onChange(() => this.updateTerrain());
    terrainFolder
      .add(this.initialParams.plane, "lacunarity", 0, 4)
      .onChange(() => this.updateTerrain());
    terrainFolder
      .add(this.initialParams.plane, "exponentation", 0, 5)
      .onChange(() => this.updateTerrain());
    terrainFolder
      .add(this.initialParams.plane, "height", 1, 100)
      .onChange(() => this.updateTerrain());
    terrainFolder
      .add(this.initialParams.plane, "octaves", 1, 20)
      .onChange(() => this.updateTerrain());
    terrainFolder
      .add(this.initialParams.plane, "texture", true, false)
      .onChange(() => {
        this.updateTerrain();
      });

    //SUN
    const sunFolder = gui.addFolder("Sun");
    sunFolder
      .add(this.initialParams.sun.position, "x", -200, 200)
      .onChange(() => {
        this.world.updateSunPosition(this.initialParams);
      });
    sunFolder
      .add(this.initialParams.sun.position, "y", -200, 200)
      .onChange(() => {
        this.world.updateSunPosition(this.initialParams);
      });
    sunFolder
      .add(this.initialParams.sun.position, "z", -200, 200)
      .onChange(() => {
        this.world.updateSunPosition(this.initialParams);
      });

    // Water
    const waterFolder = gui.addFolder("Water");
    // flatshading and resolution
    waterFolder
      .add(this.initialParams.water, "flatShading", true, false)
      .onChange(() => {
        this.updateWater();
      });

    // Helpers
    const helpersFolder = gui.addFolder("Helpers");
    helpersFolder
      .add(this.initialParams.helpers, "axesHelper", true, false)
      .onChange(() => {
        const helpers = this.world.getHelpers();
        helpers.axesHelper(this.initialParams.helpers.axesHelper);
      });
    helpersFolder
      .add(this.initialParams.helpers, "vertexNormals", true, false)
      .onChange(() => {
        const helpers = this.world.getHelpers();
        helpers.vertexNormalsHelper(this.initialParams.helpers.vertexNormals);
      });
  }

  updateTerrain() {
    this.world.removeMesh(this.initialParams.plane);
    this.world.createPlane(this.initialParams.plane);
  }

  updateWater() {
    this.water.changeWaterParams(this.initialParams.water);
  }
}
