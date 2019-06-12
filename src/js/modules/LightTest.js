import ColorGUIHelper from "./ColorGUIHelper";
import DegRadHelper from "./DegRadHelper";

export default function LightTest(objTHREE) {
	this._objTHREE = objTHREE;
	this.scene = objTHREE.scene;
	this.camera = objTHREE._options.camera.elem;
	this.camera.initialSettings = objTHREE._options.camera[this.camera.isPerspectiveCamera ? 'perspective' : 'orthographic'].initialSettings;
	this._gui = new dat.GUI();
	this.intensity = 1;
	this._lightType = null;
	this._count = 0;

	this._setEvents();
}

// testLight(lightType : String, lightColor : Hex, intensity : Float, position : Array[x, y, z], castShadow : Boolean)
// ambient | hemisphere | directional | point | spot
LightTest.prototype.testLight = function (lightType, lightColor, intensity, position, castShadow) {
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
			const skyColor = 0x0019ff; // light blue
			const groundColor = 0x000000; // brownish orange
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
			break;
		case 'point':
			this.lightColor = lightColor || 0xFFFFFF;
			this.light = new THREE.PointLight(this.lightColor, this.intensity);
			this.light.position.copy(this.camera.position);
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
	if (castShadow && typeof this.light.castShadow != 'undefined') {
		//Set up shadow properties for the light
		this.light.castShadow = true;
		this.light.shadow.mapSize.width = 1024; // default 512
		this.light.shadow.mapSize.height = 1024; // default 512
		this.light.shadow.camera.near = 10; // default 0.5
		this.light.shadow.camera.far = 1024 + 256; // default 500

		if (this.light.shadow.camera.type != 'OrthographicCamera') {
			let f = this._gui.addFolder('camera');
			f.add(this.light.shadow.camera, 'fov', 0, 120, 1);
			folder.open();
		}

		// this.light.shadow.camera.fov = 32;
		// this.light.shadow.radius = 4;
		// this.light.shadowDarkness = 0.1;

		if (this.light.isDirectionalLight) {
			this.light.shadow.camera.left = -256;
			this.light.shadow.camera.right = 256;
			this.light.shadow.camera.top = 256;
			this.light.shadow.camera.bottom = -256;
			// this.light.shadow.bias = 0.000001;
		}

		let helper = new THREE.CameraHelper(this.light.shadow.camera);
		this.scene.add(helper);
	}
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
			makeXYZGUI(this._gui, this.light.position, 'position', this.updateLight.bind(this));
			makeXYZGUI(this._gui, this.light.target.position, 'target', this.updateLight.bind(this));
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

LightTest.prototype.resetCamera = function () {
	this.camera.position.set(this.camera.initialSettings.position.x, this.camera.initialSettings.position.y, this.camera.initialSettings.position.z);
	this.camera.rotateX(this.camera.initialSettings.rotation.x);
	this.camera.rotateY(this.camera.initialSettings.rotation.y);
	this.camera.rotateZ(this.camera.initialSettings.rotation.z);
	this.camera.zoom = this.camera.initialSettings.zoom;
};

LightTest.prototype._setEvents = function () {
	let controlBlock = document.querySelector('.js-control');
	let keyCodes = {
		82: 'resetCamera'
	};
	if (controlBlock) {
		controlBlock.style.left = this._objTHREE._renderer.domElement.offsetLeft + 'px';
		controlBlock.addEventListener('click', (event) => {
			if (event.target.tagName != 'BUTTON') return;
			switch (event.target.dataset.action) {
				case 'resetCamera':
					this.resetCamera();
					break;
			}
		});
	}
	document.addEventListener('keydown', (event) => {
		switch (keyCodes[event.keyCode]) {
			case 'resetCamera':
				this.resetCamera();
				break;
		}
	});
};


function makeXYZGUI(gui, vector3, name, onChangeFn) {
	const folder = gui.addFolder(name);
	folder.add(vector3, 'x', -750, 750).onChange(onChangeFn);
	folder.add(vector3, 'z', -750, 750).onChange(onChangeFn);
	folder.add(vector3, 'y', 0, 1000).onChange(onChangeFn);
	folder.open();
}