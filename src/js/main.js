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
// Light.testLight('point', 0xffffff, 0.01, [210, 485, -180], true);
Light.testLight('directional', 0xffffff, 0.5, [-150, 600, 0], true);
// Light.testLight('ambient', 0x0000ff, 0.2);
// Light.testLight('hemisphere', null, 0.25);
Light.testLight('point', 0xff0000, 0.5, [128, 96, 0]);
Light.testLight('point', 0x00ff00, 0.5, [-128, 96, 0]);
Light.testLight('point', 0x00ff00, 0.5, [0, 96, -128]);
Light.testLight('point', 0xff0000, 0.5, [0, 96, 128]);