// Main JS module
import XYZ from "./modules/XYZ";
import LightTest from "./modules/LightTest";

// const WebGL = new XYZ('../img/webgl-map - Copy.png', 64, 64);
const WebGL = new XYZ();
const Light = new LightTest(WebGL);


WebGL.start();
WebGL.addStats();
WebGL.addHelpers();
// testLight(lightType, lightColor, intensity, position, castShadow)
// ambient | hemisphere | directional | point | spot
Light.testLight({
	type: 'directional',
	color: 0xff0000,
	intensity: 0.5,
	position: [128, 96, 0],
	castShadow: true
});
Light.testLight({
	type: 'directional',
	color: 0x0000ff,
	intensity: 0.5,
	position: [-120, 100, -115],
	castShadow: true
});
Light.testLight({
	type: 'directional',
	color: 0x00ff00,
	intensity: 0.5,
	position: [-150, 200, 0],
	castShadow: true
});
// Light.testLight('ambient', 0xffffff, 0.3);
// Light.testLight('point', 0x00ff00, 0.25, [-128, 150, 0], true);
// Light.testLight('point', 0x00ff00, 0.25, [0, 150, -128]);
// Light.testLight('point', 0xff0000, 0.25, [0, 150, 128]);
// Light.testLight('point', 0xff0000, 0.25, [128, 150, 0]);
Light.testLight({
	type: 'hemisphere',
	intensity: 0.25
});