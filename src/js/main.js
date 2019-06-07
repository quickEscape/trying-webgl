// Main JS module
import XYZ from "./modules/XYZ";

// const WebGL = new XYZ('../img/binary-bitmap.png', 80, 80);
const WebGL = new XYZ();
WebGL.start();
WebGL.addStats();
WebGL.testLight('directional');