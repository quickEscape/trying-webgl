export default function getImageData(url) {
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