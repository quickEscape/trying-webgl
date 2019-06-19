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
	color: 0xc55e2f,
	intensity: 5,
	position: [-50, 400, -30],
	castShadow: true,
	bias: -0.005
});

Light.testLight({
	type: 'point',
	color: 0x1400ff,
	intensity: 1000,
	position: [100, 40, 50],
	distance: 300
});

Light.testLight({
	type: 'point',
	color: 0xffffff,
	intensity: 100,
	position: [0, 40, -200],
	distance: 400
});

Light.testLight({
	type: 'hemisphere',
	groundColor: 0xffffff,
	intensity: 0.5
});

Light.testLight({
	type: 'spot',
	color: 0xffffff,
	intensity: 1000,
	position: [250, 0, 50],
	target: [-500, 0, 450],
	distance: 300
});