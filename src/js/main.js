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
Light.testLight('point', 0x0019ff, 0.5, [-300, 600, 0], true);
// Light.testLight('point', 0x0019ff, 0.5, [-300, 600, -100], true);
// Light.testLight('directional', 0x0019ff, 1, [-300, 600, 0], true);
Light.testLight('ambient', 0x0000ff, 0.25);
Light.testLight('hemisphere', null, 0.25);
Light.testLight('point', 0xffffff, 0.5, [250, 50, 0]);
Light.testLight('point', 0xffffff, 0.5, [-250, 50, 0]);
Light.testLight('point', 0xffffff, 0.5, [0, 50, -250]);
Light.testLight('point', 0xffffff, 0.5, [0, 50, 250]);
Light.testLight('directional', 0xffffff, 1, [-300, 400, 0]);