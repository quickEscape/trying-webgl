// Main JS module
import XYZ from "./modules/XYZ";
import LightTest from "./modules/LightTest";

// const WebGL = new XYZ('../img/binary-bitmap.png', 80, 80);
const WebGL = new XYZ();
const Light = new LightTest(WebGL);


WebGL.start();
WebGL.addStats();
WebGL.addHelpers();
Light.testLight('spot');
// Light.testLight('point', 0xff0000, 1, [-100, 200, 0]);
// Light.testLight('point', 0xf0f000, 0.25, [100, 200, 0]);
// Light.testLight('point', 0xf0ffff, 0.75, [0, 200, 0]);