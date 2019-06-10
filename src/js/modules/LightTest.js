import ColorGUIHelper from "./ColorGUIHelper";
import DegRadHelper from "./DegRadHelper";

export default function LightTest(objTHREE) {
	this.scene = objTHREE.scene;
	this._gui = new dat.GUI();
	this.intensity = 1;
	this._lightType = null;
	this._count = 0;
}

// testLight(lightType : String)
// ambient | hemisphere | directional
LightTest.prototype.testLight = function (lightType, lightColor, intensity, position) {
	this._lightType = lightType || 'directional';
	this.intensity = intensity || 1;
	switch (this._lightType) {
		case 'ambient':
			this.lightColor = lightColor || 0xFFFFFF;
			this.light = new THREE.AmbientLight(this.lightColor, this.intensity);
			if (this._count) break;
			this._gui.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('color');
			this._gui.add(this.light, 'intensity', 0, 2, 0.01);
			break;
		case 'hemisphere':
			const skyColor = 0xB1E1FF; // light blue
			const groundColor = 0xB97A20; // brownish orange
			this.light = new THREE.HemisphereLight(skyColor, groundColor, this.intensity);
			if (this._count) break;
			this._gui.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('skyColor');
			this._gui.addColor(new ColorGUIHelper(this.light, 'groundColor'), 'value').name('groundColor');
			this._gui.add(this.light, 'intensity', 0, 2, 0.01);
			break;
		case 'directional':
			this.lightColor = lightColor || 0xFFFFFF;
			this.light = new THREE.DirectionalLight(this.lightColor, this.intensity);
			this.light.position.set(100, 200, 0);
			// this.light.target.position.set(0, 0, 0);
			if (this._count) break;
			this._gui.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('color');
			this._gui.add(this.light, 'intensity', 0, 2, 0.01);
			this._gui.add(this.light.target.position, 'x', -500, 500);
			this._gui.add(this.light.target.position, 'z', -500, 500);
			this._gui.add(this.light.target.position, 'y', 0, 750);
			break;
		case 'point':
			this.lightColor = lightColor || 0xFFFFFF;
			this.light = new THREE.PointLight(this.lightColor, this.intensity);
			this.light.position.set(100, 200, 0);
			if (this._count) break;
			this._gui.addColor(new ColorGUIHelper(this.light, 'color'), 'value').name('color');
			this._gui.add(this.light, 'intensity', 0, 2, 0.01);
			this._gui.add(this.light, 'distance', 0, 1000).onChange(this.updateLight.bind(this));
			break;
		case 'spot':
			this.lightColor = lightColor || 0xffffff;
			this.light = new THREE.SpotLight(this.lightColor, this.intensity);
			this.light.position.set(200, 400, 0);
			this._gui.add(new DegRadHelper(this.light, 'angle'), 'value', 0, 90).name('angle').onChange(this.updateLight.bind(this));
			this._gui.add(this.light, 'penumbra', 0, 1, 0.01);
			break;
	}

	if (!this.light) return;
	if (position) this.light.position.set(...position);
	this.scene.add(this.light);
	this._count++;
	if (this.light.target) this.scene.add(this.light.target);

	if (this._count > 1) return;
	switch (this._lightType) {
		case 'directional':
			this.addHelper();
			makeXYZGUI(this._gui, this.light.position, 'position', this.updateLight.bind(this));
			makeXYZGUI(this._gui, this.light.target.position, 'target', this.updateLight.bind(this));
			break;
		case 'point':
			this.addHelper();
			makeXYZGUI(this._gui, this.light.position, 'position', this.updateLight.bind(this));
			break;
		case 'spot':
			this.addHelper();
			this.lightColor = lightColor || 0xffffff;
			this.light = new THREE.SpotLight(this.lightColor, this.intensity);
			break;
	}
};

LightTest.prototype.addHelper = function (size, color) {
	switch (this._lightType) {
		case 'directional':
			// THREE.DirectionalLightHelper(light : DirectionalLight, size : Number, color : Hex)
			this.helper = new THREE.DirectionalLightHelper(this.light, size || 20, color || this.lightColor);
			this.updateLight();
			break;
		case 'point':
			// THREE.PointLightHelper(light : PointLight, sphereSize : Float, color : Hex)
			this.helper = new THREE.PointLightHelper(this.light, size || 20, color || this.lightColor);
			break;
		case 'spot':
			this.helper = new THREE.SpotLightHelper(this.light, color || this.lightColor);
			break;
	}
	this.scene.add(this.helper);
};

LightTest.prototype.updateLight = function () {
	if (this._lightType == 'directional') this.light.target.updateMatrixWorld();
	this.helper.update();
};

function makeXYZGUI(gui, vector3, name, onChangeFn) {
	const folder = gui.addFolder(name);
	folder.add(vector3, 'x', -500, 500).onChange(onChangeFn);
	folder.add(vector3, 'z', -500, 500).onChange(onChangeFn);
	folder.add(vector3, 'y', 0, 750).onChange(onChangeFn);
	folder.open();
}