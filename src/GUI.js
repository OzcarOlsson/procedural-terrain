export class GUI {
  constructor(initialParams, World) {
    this.initialParams = initialParams;
    this.world = World;
    this.setupGUI();
  }

  setupGUI() {
    const gui = new dat.GUI();

    gui
      .add(this.initialParams.plane, "scale", 1, 100)
      .onChange(() => this.updateParams());
    gui
      .add(this.initialParams.plane, "persistence", 0, 4)
      .onChange(() => this.updateParams());
    gui
      .add(this.initialParams.plane, "lacunarity", 0, 4)
      .onChange(() => this.updateParams());
    gui
      .add(this.initialParams.plane, "exponentation", 0, 5)
      .onChange(() => this.updateParams());
    gui
      .add(this.initialParams.plane, "height", 1, 10)
      .onChange(() => this.updateParams());
    gui
      .add(this.initialParams.plane, "octaves", 1, 20)
      .onChange(() => this.updateParams());
  }

  updateParams() {
    this.world.removeMesh(this.initialParams.plane);
    this.world.createPlane(this.initialParams.plane);
  }
}
