let gameGrid;

let f1;
let y = 0;

let tickTimer;

function setup() {
	createCanvas(400, 640);
	gameGrid = multArr(20, 10);
	gameGrid.forEach((layer) => {
		layer.fill(false);
	});
	f1 = new Figure([[1, 1, 1, 1], [0, 0, 0, 0]]);
	tickTimer = new Date();
}

function draw() {
	background(51);
	f1.draw(20, 20);
	let currentTime = new Date().getTime()
	if (currentTime - tickTimer.getTime() > 400) {
		f1.move(0, y);
		tickTimer.setTime(currentTime);
		if (y < 19) {
			y++;
		}
	}

	frameRate(60);
}