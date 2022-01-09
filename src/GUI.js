export class GUI {
  constructor(initialParams, World) {
    this.initialParams = initialParams;
    this.world = World;
    this.setupGUI();
  }

  setupGUI() {
    const gui = new dat.GUI();

    // Terrain
    const terrainFolder = gui.addFolder("Terrain");
    terrainFolder
      .add(this.initialParams.plane, "scale", 1, 100)
      .onChange(() => this.updateParams());
    terrainFolder
      .add(this.initialParams.plane, "persistence", 0, 4)
      .onChange(() => this.updateParams());
    terrainFolder
      .add(this.initialParams.plane, "lacunarity", 0, 4)
      .onChange(() => this.updateParams());
    terrainFolder
      .add(this.initialParams.plane, "exponentation", 0, 5)
      .onChange(() => this.updateParams());
    terrainFolder
      .add(this.initialParams.plane, "height", 1, 10)
      .onChange(() => this.updateParams());
    terrainFolder
      .add(this.initialParams.plane, "octaves", 1, 20)
      .onChange(() => this.updateParams());

    //SUN
    const sunFolder = gui.addFolder("Sun");
    sunFolder
      .add(this.initialParams.sun.position, "z", -100, 100)
      .onChange(() => {
        this.world.updateSunPosition(this.initialParams.sun.position);
      });
    // folder.add(this.initialParams.sun.position, "x", -100, 100). on

    // Water
    const waterFolder = gui.addFolder("Water");
    // flatshading and resolution
  }

  updateParams() {
    this.world.removeMesh(this.initialParams.plane);
    this.world.createPlane(this.initialParams.plane);
  }
}

// const gui = new GUI();

// 				const folderSky = gui.addFolder( 'Sky' );
// 				folderSky.add( parameters, 'elevation', 0, 90, 0.1 ).onChange( updateSun );
// 				folderSky.add( parameters, 'azimuth', - 180, 180, 0.1 ).onChange( updateSun );
// 				folderSky.open();

// 				const waterUniforms = water.material.uniforms;

// 				const folderWater = gui.addFolder( 'Water' );
// 				folderWater.add( waterUniforms.distortionScale, 'value', 0, 8, 0.1 ).name( 'distortionScale' );
// 				folderWater.add( waterUniforms.size, 'value', 0.1, 10, 0.1 ).name( 'size' );
// 				folderWater.open();

// function render() {

// 	const time = performance.now() * 0.001;

// 	mesh.position.y = Math.sin( time ) * 20 + 5;
// 	mesh.rotation.x = time * 0.5;
// 	mesh.rotation.z = time * 0.51;

// 	water.material.uniforms[ 'time' ].value += 1.0 / 60.0;

// 	renderer.render( scene, camera );

// }
