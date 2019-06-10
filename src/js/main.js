// Main JS module
import XYZ from "./modules/XYZ";
import LightTest from "./modules/LightTest";

// const WebGL = new XYZ('../img/binary-bitmap.png', 80, 80);
const WebGL = new XYZ();
const Light = new LightTest(WebGL);


WebGL.start();
WebGL.addStats();
WebGL.addHelpers();
// testLight(lightType, lightColor, intensity, position, castShadow)
// ambient | hemisphere | directional | point | spot
Light.testLight('point', null, null, null, true);
// Light.testLight('point', 0xf0ffff, 0.75, [0, 200, 0]);