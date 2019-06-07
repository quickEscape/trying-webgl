	export default function XYZ(userOptions) {
		this._options = {
			canvas: {
				width: 800,
				height: 450,
				elem: null
			},
			camera: {
				type: 'perspective',
				fov: 75,
				aspect: 16 / 9,
				near: 0.1,
				far: 1000,
				elem: null
			},
			plane: {
				width: 400,
				height: 400,
				wSegments: 1,
				hSegments: 1,
				color: 0x0000ff, //string or hex
				geometry: null,
				material: null,
				elem: null
			},
			figure: {
				width: 400,
				height: 400,
				blockSize: 10,
				blockSpacing: 1
			},
			stepsToDone: 125,
			imgUrl: '../img/binary-bitmap.png'
		};
		this._step = this._options.figure.width / Math.pow(this._options.figure.blockSize, 2);
		this._isDone = this.statsEnabled = !1;
		this._currentStep = this._i = 0;
		this._scene = this._renderer = null;
		this.lights = [];
		this.cubes = [];
		this._cubesMaxScaleY = [];
		this._cond = this._options.plane.width / this._options.figure.blockSize * this._options.plane.height / this._options.figure.blockSize;
		this._init();
	}

	XYZ.prototype._setupCamera = function () {
		// THREE.PerspectiveCamera(fov, aspect, near, far)
		// THREE.OrthographicCamera(left, right, top, bottom, near, far)
		this._options.camera.elem = this._options.camera.type == 'perspective' ?
			new THREE.PerspectiveCamera(this._options.camera.fov, this._options.canvas.width / this._options.canvas.height, this._options.camera.near, this._options.camera.far) :
			new THREE.OrthographicCamera(this._options.canvas.width / -2, this._options.canvas.width / 2, this._options.canvas.height / 2, this._options.canvas.height / -2, this._options.camera.near, this._options.camera.far);
		// place the camera at x,y,z
		this._options.camera.elem.position.set(this._options.plane.width / 2, this._options.plane.width / 1.5, this._options.plane.width / 1.5);
		// camera look at x,y,z
		this._options.camera.elem.lookAt(0, 0, 0);
	};

	XYZ.prototype._setupPlane = function () {
		//THREE.PlaneGeometry (width, height, widthSegments, heightSegments)
		this._options.plane.geometry = new THREE.PlaneGeometry(this._options.plane.width, this._options.plane.height, this._options.plane.wSegments, this._options.plane.hSegments);
		this._options.plane.material = new THREE.MeshBasicMaterial({
			color: this._options.plane.color
		});
		this._options.plane.elem = new THREE.Mesh(this._options.plane.geometry, this._options.plane.material);
		this._options.plane.elem.rotation.x = -0.5 * Math.PI;
		this._scene.add(this._options.plane.elem);
	};

	// improve this func
	// _setupFigure(color: string or hex)
	XYZ.prototype._setupFigure = function (color) {
		/* we're creating a cube to put in our scene - don't worry
		if you don't follow this part, we'll cover geometry and materials
		in future posts */
		// THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
		let geometry = new THREE.BoxGeometry(this._options.figure.blockSize - this._options.figure.blockSpacing, this._options.figure.blockSpacing, this._options.figure.blockSize - this._options.figure.blockSpacing);
		let material = new THREE.MeshLambertMaterial({
			color
		});

		for (let i = -this._options.plane.width / 2 + this._options.figure.blockSize / 2; i < this._options.plane.width / 2; i += this._options.figure.blockSize) {
			for (let j = this._options.plane.height / 2 - this._options.figure.blockSize / 2; j > -this._options.plane.height / 2; j -= this._options.figure.blockSize) {
				this.cubes.push(new THREE.Mesh(geometry, material));
				this.cubes[this.cubes.length - 1].position.x = i;
				this.cubes[this.cubes.length - 1].position.z = j;
				this.cubes[this.cubes.length - 1].position.y = -1;
				this._scene.add(this.cubes[this.cubes.length - 1]);
			}
		}
	};

	// improve this func
	// _setupLights(color: string or hex, posY: position y)
	XYZ.prototype._setupLights = function (color, posY) {
		/* we need to add a light so we can see our cube - its almost
		as if we're turning on a lightbulb within the room */
		for (let i = -this._options.plane.width / 2 + 250 / 2; i < this._options.plane.width / 2; i += 250) {
			for (let j = this._options.plane.height / 2 - 250 / 2; j > -this._options.plane.height / 2; j -= 250) {
				this.lights.push(new THREE.PointLight(color));
				/* position the light so it shines on the cube (x, y, z) */
				this.lights[this.lights.length - 1].position.set(i, posY, j);
				this._scene.add(this.lights[this.lights.length - 1]);
			}
		}
	};

	XYZ.prototype._setupControls = function () {
		this._controls = new THREE.OrbitControls(this._options.camera.elem, this._renderer.domElement); //controls.update() must be called after any manual changes to the camera's transform
		this._controls.update();
	};

	// _setupHelpers(size: integer, position: object {x, y, z})
	XYZ.prototype._setupHelpers = function (size, position) {
		this._axes = new THREE.AxesHelper(size);
		this._axes.position(position.x, position.y, position.z);
		this._scene.add(this._axes);
	};

	XYZ.prototype.addStats = function () {
		// init stat
		this._stat = {
			rendererStats: new THREEx.RendererStats(),
			statsJS: new Stats()
		};
		// set rendererStats styles
		this._stat.rendererStats.domElement.style.position = 'absolute';
		this._stat.rendererStats.domElement.style.left = '0px';
		this._stat.rendererStats.domElement.style.bottom = '50%';
		// set statsJS styles
		this._stat.statsJS.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
		this._stat.statsJS.dom.style.right = '0px';
		this._stat.statsJS.dom.style.bottom = '50%';
		this._stat.statsJS.dom.style.top = 'unset';
		this._stat.statsJS.dom.style.left = 'unset';
		// add stat in DOM
		document.body.appendChild(this._stat.rendererStats.domElement);
		document.body.appendChild(this._stat.statsJS.dom);
		this.statsEnabled = !0;
	};

	XYZ.prototype.start = function () {
		const loadImage = getImageData(this._options.imgUrl);
		this._imageMap = [];

		loadImage
			.then((res) => {
				for (let i = 0; i < res.data.length; i += this._step)
					this._imageMap.push(res.data[i] == 255 ? 0 : res.data[i + 3] / 255);
				this._render();
			})
			.catch((error) => {
				console.log(error);
			});
	};

	XYZ.prototype._setEvents = function () {
		this._renderer.domElement.ondblclick = () => {
			// console.log(this._options.camera.elem.position);
			this._isDone = !this._isDone;
			this._currentStep = 0;
			for (let i = 0; i < this._cond; i++)
				this.cubes[i].scale.y = 1;
		};
	};

	XYZ.prototype._init = function () {
		//start webGL block code
		this._scene = new THREE.Scene();
		// add a camera
		this._setupCamera();
		this._renderer = new THREE.WebGLRenderer({
			alpha: true
		});
		this._renderer.setClearColor(0x000000, 0);
		this._renderer.setSize(this._options.canvas.width, this._options.canvas.height);
		document.body.appendChild(this._renderer.domElement);
		this._setupPlane();
		this._setupControls();
		this._setupFigure(0x0000ff);
		this._setupLights(0xffffff, 750);

		// events
		this._setEvents();
	};

	XYZ.prototype._render = function () {
		requestAnimationFrame(() => this._render());

		if (this.statsEnabled) this._stat.statsJS.begin();

		// required if controls.enableDamping or controls.autoRotate are set to true
		this._controls.update();

		// save cubes's maximum scale y into array and stop initial animation
		if (this._options.stepsToDone == this._currentStep) {
			this._isDone = !this._isDone;
			for (let i = 0; i < this._cond; i++)
				this._cubesMaxScaleY.push([this.cubes[i].scale.y - this.cubes[i].scale.y * 0.05, this.cubes[i].scale.y + this.cubes[i].scale.y * 0.05]);
			this._currentStep++;
		}

		// animation
		if (!this._isDone) {
			for (let i = 0; i < this._cond; i++) {
				if (this._imageMap[i])
					scaleY(this.cubes[i], this.cubes[i].scale.y + this._imageMap[i]);
				// extrude with random from 0 to 1
				// scaleY(this.cubes[i], this.cubes[i].scale.y + Math.random() * this._imageMap[i]);

			}
			this._currentStep++;
		}
		// else {
		// 	if (this._i % 20 == 0) {
		// 		let cubesNewScaleY = [];
		// 		for (let i = 0; i < this._cond; i++) {
		// 			if (!this._imageMap[i]) continue;
		// 			if (this.cubes[i].scale.y < this._cubesMaxScaleY[i][0]) {
		// 				cubesNewScaleY[i] = Math.random() * this._imageMap[i];
		// 			} else if (this.cubes[i].scale.y > this._cubesMaxScaleY[i][1]) {
		// 				cubesNewScaleY[i] = -Math.random() * this._imageMap[i];
		// 			} else {
		// 				cubesNewScaleY[i] = Math.random() * (this._imageMap[i] + this._imageMap[i]) - this._imageMap[i];
		// 			}
		// 			scaleY(this.cubes[i], this.cubes[i].scale.y + cubesNewScaleY[i] * 0.1);

		// 			// if(this._i <= 10) {
		// 			// scaleY(this.cubes[i], this.cubes[i].scale.y -  Math.random() * this._imageMap[i]);
		// 			// } else if(this._i <= 20) {
		// 			// 	scaleY(this.cubes[i], this.cubes[i].scale.y +  Math.random() * this._imageMap[i]);
		// 			// } else {
		// 			// 	this._i = 0;
		// 			// }
		// 		}
		// 	}
		// 	this._i++;
		// }

		this._options.camera.elem.updateProjectionMatrix();

		if (this.statsEnabled) this._stat.rendererStats.update(this._renderer);

		// render the scene
		this._renderer.render(this._scene, this._options.camera.elem);

		if (this.statsEnabled) this._stat.statsJS.end();
	};

	function scaleY(mesh, scale) {
		mesh.scale.y = scale;
		if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
		let height = mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y;
		//height is here the native height of the geometry
		//that does not change with scaling. 
		//So we need to multiply with scale again
		mesh.position.y = height * scale / 2;
	}

	function getImageData(url) {
		let loadImage = new Promise(function (resolve, reject) {
			let img = new Image();
			img.onload = () => {
				let canvas = document.createElement('canvas');
				canvas.width = img.width;
				canvas.height = img.height;
				let ctx = canvas.getContext('2d');
				ctx.drawImage(img, 0, 0);
				resolve(ctx.getImageData(0, 0, canvas.width, canvas.height));
			};
			img.src = url;
		});
		return loadImage;
	}