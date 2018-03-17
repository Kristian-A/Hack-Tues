// let gameGrid = [];
// let currentFigure;
// let tickTimer;
// let score = 0;
//
// let figuresPreset;

// function asdf() {
// 	//createCanvas(320, 640);
// 	gameGrid = multArr(20, 10);
// 	gameGrid.forEach((layer) => {
// 		layer.fill(null);
// 	});
//
// 	figuresPreset = [
// 		[[2, 1, 1, 1], [0, 0, 0, 0]],
// 		[[2, 1, 0, 0], [1, 1, 0, 0]],
// 		[[2, 1, 1, 0], [0, 1, 0, 0]],
// 		[[2, 1, 0, 0], [0, 1, 1, 0]],
// 		[[0, 1, 1, 0], [1, 2, 0, 0]],
// 		[[2, 0, 0, 0], [1, 1, 1, 0]],
// 		[[2, 1, 1, 0], [1, 0, 0, 0]]
// 	];
// 	currentFigure = new Figure(random(figuresPreset));
// 	tickTimer = new Date();
// }

function shiftDown(lowest) {
	for (let i = lowest; i >= 0; i--) {
		gameGrid[i].forEach(block => {
			if (block != null) {
				block.move(block.x, block.y+1, true);
			}
		});
	}
	score += 100;
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


function keyTyped() {
	if (key == "d") {
		currentFigure.right();
	} else if (key == "a") {
		currentFigure.left();
	} else if (key == "s") {
		currentFigure.down();
	} else if (key == "q") {
		currentFigure.rotate(1);
	} else if (key == "e") {
		currentFigure.rotate(-1);
	}

	return false;
}
