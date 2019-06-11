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
Light.testLight('point', 0xa3f208, 0.5, [0, 750, 0], true);
Light.testLight('ambient', 0xffffff, 0.5, [0, 500, 0]);
Light.testLight('directional', 0xf28a30, 0.5, [-200, 300, 200]);