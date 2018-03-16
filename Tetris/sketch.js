let gameGrid;
let currentFigure;
let tickTimer;
let figures = [];
let visibleFigures = [];
let figureIndex = 1;

function setup() {
	createCanvas(320, 640);
	gameGrid = multArr(20, 10);
	gameGrid.forEach((layer) => {
		layer.fill(false);
	});

	figures = [];
	for (let i = 0; i < 5; i++) { 
		figures.push(new Figure([[1, 1, 1, 1], [0, 0, 0, 0]]));
	}
	currentFigure = figures[0];
	visibleFigures.push(figures[0]);
	tickTimer = new Date();
}

function draw() {
	background(51);
	
	let currentTime = new Date().getTime()
	if (currentTime - tickTimer.getTime() > 400) {
		tickTimer.setTime(currentTime);
		if (currentFigure.blockBelow()) {
			currentFigure = figures[figureIndex];
			visibleFigures.push(currentFigure);
			figureIndex++;
		}
		currentFigure.down()
	}

	visibleFigures.forEach(figure => {
		figure.draw();
	});
}

function keyTyped() {
	if (key == "d") {
		currentFigure.right();
	} else if (key == "a") {
		currentFigure.left();
	} else if (key == "s") {
		currentFigure.down();
	}

	return false;
}