let gameGrid = [];
let currentFigure;
let tickTimer;
let figures = [];
let figureIndex = 1;
let score = 0;

function setup() {
	createCanvas(320, 640);
	gameGrid = multArr(20, 10);
	gameGrid.forEach((layer) => {
		layer.fill(null);
	});

	figures = [];
	figures.push(new Figure([[1, 1, 1, 1], [0, 0, 0, 0]]));
	figures.push(new Figure([[1, 1, 1, 0], [0, 0, 0, 0]]));
	figures.push(new Figure([[1, 1, 1, 0], [0, 0, 0, 0]]));
	for (let i = 0; i < 2; i++) { 
		figures.push(new Figure([[0, 0, 1, 0], [1, 1, 1, 0]]));
	}
	currentFigure = figures[0];
	tickTimer = new Date();
}

function shiftDown(lowest) {
	for (let i = lowest; i >= 0; i--) {
		gameGrid[i].forEach(block => {
			if (block != null) {
				block.move(block.x, block.y+1, true);
			}
		}); 
	}
	score+=100;
	console.log(score); 
}

function checkLayers() {
	for (let i = 0; i < gameGrid.length; i++) {
		let layer = gameGrid[i];
		let filled = true;
		for (let j = 0; j < layer.length; j++) {
			if (layer[j] == null) {
				filled = false;
			}	
		}
		if (filled) {

			for (let j = 0; j < layer.length; j++) {
				layer[j] = null;
			}
			shiftDown(i);
		}
	}
}

function draw() {
	background(51);
	
	let currentTime = new Date().getTime()
	if (currentTime - tickTimer.getTime() > 400) {
		tickTimer.setTime(currentTime);
		if (currentFigure.blockDown()) {
			currentFigure = figures[figureIndex];
			figureIndex++;
		}
		currentFigure.down()
	}
	gameGrid.forEach(layer => {
		layer.forEach(block => { 
			if (block != null) {
				block.draw();
			}
		})
	});
	checkLayers();
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