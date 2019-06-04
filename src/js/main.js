// Main JS module

//options
const height = 450;
const width = 800;
const planeWidth = 400;
const planeHeight = 400;
const blockSize = 10;
const blockSpacing = 1;
const step = planeWidth / (blockSize * blockSize);
let init = !0;
let count = direction = then = 0;
let maxCount = 125;
let scene, camera, renderer, planeGeometry, planeMaterial, geometry, material, controls, plane, rendererStats, stats;
let animationSpeed = 1.2;
const maxScale = [];
const newPos = [];
const light = [];

const loadImage = getImageData('../img/binary-bitmap.png');
const imageMap = [];
const cube = [];

initWebGL();

loadImage
	.then((res) => {
		for (let index = 0; index < res.data.length; index += step)
			imageMap.push(res.data[index] == 255 ? 0 : res.data[index + 3] / 255);
		render();
	})
	.catch((error) => {
		console.log(error);
	});

//statistics info
addStats();

function initWebGL() {
	//start webGL block code
	scene = new THREE.Scene();

	// add a camera
	// THREE.PerspectiveCamera(fov, aspect, near, far)
	camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
	// camera = new THREE.OrthographicCamera(width / -2, width / 2, height / 2, height / -2, 1, 1000);
	// place the camera at x,y,z of 200 and look at 0,0,0
	camera.position.set(planeWidth / 2, planeWidth / 1.5, planeWidth / 1.5);
	camera.lookAt(0, 0, 0);

	// add a renderer
	renderer = new THREE.WebGLRenderer({
		alpha: true
	});
	renderer.setClearColor(0x000000, 0);
	renderer.setSize(width, height);
	// add the renderer element to the DOM so it is in our page
	document.body.appendChild(renderer.domElement);

	//try add plane to scene (width : Float, height : Float, widthSegments : Integer, heightSegments : Integer)
	planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 1, 1);
	planeMaterial = new THREE.MeshBasicMaterial({
		color: 0x0000ff
	});
	plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.rotation.x = -0.5 * Math.PI;
	scene.add(plane);

	/* we're creating a cube to put in our scene - don't worry
	if you don't follow this part, we'll cover geometry and materials
	in future posts */
	geometry = new THREE.BoxGeometry(blockSize - blockSpacing, blockSpacing, blockSize - blockSpacing);
	material = new THREE.MeshLambertMaterial({
		color: 0x0000ff
	});

	for (let i = -planeWidth / 2 + blockSize / 2; i < planeWidth / 2; i += blockSize) {
		for (let j = planeHeight / 2 - blockSize / 2; j > -planeHeight / 2; j -= blockSize) {
			cube.push(new THREE.Mesh(geometry, material));
			cube[cube.length - 1].position.x = i;
			cube[cube.length - 1].position.z = j;
			cube[cube.length - 1].position.y = -1;
			scene.add(cube[cube.length - 1]);
		}
	}

	/* we need to add a light so we can see our cube - its almost
	as if we're turning on a lightbulb within the room */
	for (let i = -planeWidth / 2 + 250 / 2; i < planeWidth / 2; i += 250) {
		for (let j = planeHeight / 2 - 250 / 2; j > -planeHeight / 2; j -= 250) {
			light.push(new THREE.PointLight(0xffffff));
			/* position the light so it shines on the cube (x, y, z) */
			light[light.length - 1].position.set(i, 750, j);
			scene.add(light[light.length - 1]);
		}
	}

	// add controls
	controls = new THREE.OrbitControls(camera, renderer.domElement); //controls.update() must be called after any manual changes to the camera's transform
	controls.update();

	// add helpers
	// const axes = new THREE.AxesHelper(100);
	// axes.position.y = 10;
	// scene.add(axes);
}

// a render loop
function render(now) {
	requestAnimationFrame(render);

	// now *= 0.001;
	// let deltaTime = now - then;
	// then = now;

	stats.begin();

	// required if controls.enableDamping or controls.autoRotate are set to true
	controls.update();

	if (count == maxCount) {
		init = !init;
		for (let i = 0; i < planeWidth / blockSize * planeHeight / blockSize; i++)
			maxScale.push([cube[i].scale.y - cube[i].scale.y * 0.05, cube[i].scale.y + cube[i].scale.y * 0.05]);
		count++;
	}
	if (init) {
		for (let i = 0; i < planeWidth / blockSize * planeHeight / blockSize; i++) {
			if (imageMap[i])
				scaleY(cube[i], cube[i].scale.y + imageMap[i]);
			// scaleY(cube[i], cube[i].scale.y + Math.random() * imageMap[i]); // extrude with random from 0 to 1
		}
	} else {
		for (let i = 0; i < planeWidth / blockSize * planeHeight / blockSize; i++) {
			if (!imageMap[i]) continue;
			if (direction % 20 == 0) {
				if (cube[i].scale.y < maxScale[i][0]) {
					newPos[i] = Math.random() * imageMap[i];
				} else if (cube[i].scale.y > maxScale[i][1]) {
					newPos[i] = -Math.random() * imageMap[i];
				} else {
					newPos[i] = Math.random() * (imageMap[i] + imageMap[i]) - imageMap[i];
				}
			}
			scaleY(cube[i], cube[i].scale.y + newPos[i] * 0.1);

			// if(direction <= 10) {
			// scaleY(cube[i], cube[i].scale.y -  Math.random() * imageMap[i]);
			// } else if(direction <= 20) {
			// 	scaleY(cube[i], cube[i].scale.y +  Math.random() * imageMap[i]);
			// } else {
			// 	direction = 0;
			// }
		}
		// delay = !delay;
		direction++;
	}
	count++;

	camera.updateProjectionMatrix();

	rendererStats.update(renderer);

	// render the scene
	renderer.render(scene, camera);

	stats.end();
};

function scaleY(mesh, scale) {
	mesh.scale.y = scale;
	if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
	var height = mesh.geometry.boundingBox.max.y - mesh.geometry.boundingBox.min.y;
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

function addStats() {
	rendererStats = new THREEx.RendererStats();
	rendererStats.domElement.style.position = 'absolute';
	rendererStats.domElement.style.left = '0px';
	rendererStats.domElement.style.bottom = '50%';
	document.body.appendChild(rendererStats.domElement);

	stats = new Stats();
	stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
	stats.dom.style.right = '0px';
	stats.dom.style.bottom = '50%';
	stats.dom.style.top = 'unset';
	stats.dom.style.left = 'unset';
	document.body.appendChild(stats.dom);
}

renderer.domElement.addEventListener('dblclick', function () {
	console.log(camera.position);
	init = !init;
	count = 0;
	for (let i = 0; i < planeWidth / blockSize * planeHeight / blockSize; i++)
		cube[i].scale.y = 1;
});