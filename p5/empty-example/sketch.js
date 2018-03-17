let capture;
let w = 640;
let h = 640;

let brightestPosX = 0;
let brightestPosY = 0;


let targets = [{r: 255, g: 0, b: 0}, {r: 0, g: 0, b: 255}];
let border = 75;
let clickCount = 0;

let maxDifference = 200;
let rotationThreshhold = 45;
let zeroingThreshhold = 30  ;
let rotated = false;

let dropTrigger = 0.70 * (h-180);
let dropReset = 0.50 * (h-180);
let dropped = false;


let gameGrid = [];
let currentFigure;
let tickTimer;
let score = 0;


function setup() {
    createCanvas(w+320, h);
    background(0);
    frame = createCapture(VIDEO);
    //scale(-1.0,1.0);
    frame.hide();
    // frameRate(30);
    //capture.hide();

    frame.size(w, h-180);

    gameGrid = multArr(20, 10);
	gameGrid.forEach((layer) => {
		layer.fill(null);
	});

	figuresPreset = [
		[[2, 1, 1, 1], [0, 0, 0, 0]],
		[[2, 1, 0, 0], [1, 1, 0, 0]],
		[[2, 1, 1, 0], [0, 1, 0, 0]],
		[[2, 1, 0, 0], [0, 1, 1, 0]],
		[[0, 1, 1, 0], [1, 2, 0, 0]],
		[[2, 0, 0, 0], [1, 1, 1, 0]],
		[[2, 1, 1, 0], [1, 0, 0, 0]]
	];
	currentFigure = new Figure(random(figuresPreset));
	tickTimer = new Date();

}

function mousePressed(){

    //translate(320,0);
    let x = mouseX+320;
    let y = mouseY;
    let pixel = (y*frame.width + x) * 4;
    let current = clickCount % 2;
    targets[current].r = frame.pixels[pixel];
    targets[current].g = frame.pixels[pixel+1];
    targets[current].b = frame.pixels[pixel+2];
    clickCount++;
}

function draw() {
    background(51);

	let currentTime = new Date().getTime()
	if (currentTime - tickTimer.getTime() > 400) {
		tickTimer.setTime(currentTime);
		if (currentFigure.blockDown()) {
			currentFigure = new Figure(random(figuresPreset));
			checkLayers();
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
    // translate(width,0);
    // scale(-1.0,1.0);
    translate(320, 0);
    angleMode(DEGREES);
    image(frame, 0, 0,  w, h - 180);
    frame.loadPixels();
    let avgX = [0, 0];
    let avgY = [0, 0];
    let rTargets = [targets[0].r, targets[1].r];
    let gTargets = [targets[0].g, targets[1].g];
    let bTargets = [targets[0].b, targets[1].b];
    if (frame.pixels.length > 0) {
        let i = 0;
        let count = [0, 0];
        for (var y = 0; y < frame.height; y++) {
            for (var x = 0; x < frame.width; x++) {
                let rCurrent = frame.pixels[i];
                let gCurrent = frame.pixels[i+1];
                let bCurrent = frame.pixels[i+2];

                for (var j = 0; j < targets.length; j++) {
                    let d = distSq(rCurrent, gCurrent, bCurrent, rTargets[j], gTargets[j], bTargets[j]);
                    if(d < border*border) {
                      avgX[j] += x;
                      avgY[j] += y;
                      count[j]++;
                    }
                }
                i += 4;
            }
        }
        for (var j = 0; j < targets.length; j++) {
            if(count[j] > 0) {

                avgX[j] = avgX[j] / count[j];
                avgY[j] = avgY[j] / count[j];
                fill(targets[j].r, targets[j].g, targets[j].b);
                //strokeWeight(4.0);
                stroke(0);
                ellipse(avgX[j], avgY[j], 10, 10);
            }
        }

    }
    let avgPoint = {
        x: (avgX[0] + avgX[1]) / 2,
        y: (avgY[0] + avgY[1]) / 2
    };

    fill(255);
    ellipse(avgPoint.x, avgPoint.y, 10, 10);

    let column = ceil(avgPoint.x / (w/10));
    currentFigure.move(column, currentFigure.y);
    //console.log(column);
    //console.log(column);

    fill(255, 100);
    noStroke();
    rect((column-1)*(w/10), 0, w/10, height-180);

    let deltaX = avgX[0] - avgX[1];
    let deltaY = avgY[0] - avgY[1];
    let rotation = "cw";
    if (deltaY < 0) {
        deltaY *= -1;
        rotation = "ccw";
    }
    let hypothenuse = sqrt(deltaX*deltaX + deltaY*deltaY);
    let angle = asin(deltaY/hypothenuse);

    if (!rotated) {
        if (angle > rotationThreshhold) {
            console.log(rotation);
            rotated = true;
        }
    }
    else {
        if (angle < zeroingThreshhold) {
            console.log("Zeroed");
            if(deltaX < 0) {
                let temp = targets[0];
                targets[0] = targets[1];
                targets[1] = temp;
            }
            rotated = false;
        }
    }

    stroke(255,100);
    if (!dropped) {
        if (avgPoint.y > dropTrigger) {
            console.log("Trigger");
            dropped = true;
            currentFigure.move(currentFigure.x, currentFigure.y+1);
        }
        line(0, dropTrigger, width, dropTrigger);
    }

    else {
        if(avgPoint.y < dropReset) {
            console.log("Reset");
            dropped = false;
        }
        line(0, dropReset, width, dropReset);
    }
    for (var i = 0; i < 10; i++) {
        stroke(255, 100);
        line((w/10)*i , 0, (w/10)*i, height-180);
    }

    frame.updatePixels();
}
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


function distSq(x1, y1, z1, x2, y2, z2) {
  let d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) +(z2-z1)*(z2-z1);
  return d;

}

let blockSize =32;

function multArr(y, x) {
	let arr = [];
	for (let i = 0; i < y; i++) {
		let layer = new Array(x);
		arr.push(layer);
	}
	return arr;
}

class Block {

	constructor(xOff, yOff, fig) {
		this.xOff = xOff;
		this.yOff = yOff;
		this.x = xOff;
		this.y = yOff;
		this.figure = fig;
	}

	move(x, y, param = false) {
		gameGrid[this.y][this.x] = null;
		if (param) {
			this.x = x;
			this.y = y;
			gameGrid[y][x] = this;
		} else {
			this.x = (x + this.xOff);
			this.y = (y + this.yOff);
		}
	}

	draw() {
		stroke(0);
		fill(255, 0, 0);
		rect(this.x*blockSize, this.y*blockSize, blockSize, blockSize);
	}

}

class Figure {

	constructor(arr) {
		this.blocks = [];
		for (let y = 0; y < 2; y++) {
			for (let x = 0; x < 4; x++) {
				if (arr[y][x]) {
					if (arr[y][x] == 2) {
						this.middleBlock = new Block(x, y);
						this.blocks.push(new Block(x, y, this));
					} else {
						this.blocks.push(new Block(x, y, this));
					}
				}
			}
		}
		this.edges();
		this.x = 5;
		this.y = 0;
	}

	edges() {

		this.rightX = 0;
		this.leftX = 4;

		this.blocks.forEach(block => {
			if (this.rightX < block.xOff) {
				this.rightX = block.xOff;
			}
			if (this.leftX > block.xOff) {
				this.leftX = block.xOff;
			}
		})
	}

	right() {
		if (!this.blockRight()) {
			this.move(this.x+1, this.y);
		}
	}

	left() {
		if (!this.blockLeft()) {
			this.move(this.x-1, this.y);
		}
	}

	down() {
		if (!this.blockDown()) {
			this.move(this.x, this.y+1);
		}
	}

	blockRight() {
		for (let i = 0; i < this.blocks.length; i++) {
			let current = this.blocks[i];
			if (this.x == 9 - abs(this.rightX) || gameGrid[current.y][current.x+1] != null) {
				if (!this.blockInFigure(current.x+1, current.y)) {
					return true;
				}
			}
		}
		return false;
	}

	blockLeft() {
		for (let i = 0; i < this.blocks.length; i++) {
			let current = this.blocks[i];
			if (this.x <= abs(this.leftX) || gameGrid[current.y][current.x-1] != null) {
				if (!this.blockInFigure(current.x-1, current.y)) {
					return true;
				}
			}
		}
		return false;
	}

	blockDown() {
		for (let i = 0; i < this.blocks.length; i++) {
			let current = this.blocks[i];
			if (current.y + 1 == 20 || gameGrid[current.y + 1][current.x] != null) {
				if (!this.blockInFigure(current.x, current.y+1)) {
					return true;
				}
			}
		}
		return false;
	}

	blockInFigure(x, y) {
		for (var i = 0; i < this.blocks.length; i++) {
			if (this.blocks[i].x == x && this.blocks[i].y == y) {
				return true;
			}
		}
		return false;
	}

	rotate(amount) {
    push();
    angleMode(RADIANS);
		let positions = [];

		for (let i = 0; i < this.blocks.length; i++) {
      console.log("afds");
			let current = this.blocks[i];

			let xDist = abs(current.xOff);// - this.middleBlock.xOff);
			let yDist = abs(current.yOff);// - this.middleBlock.yOff);
			let dist = sqrt(xDist*xDist + yDist*yDist);
			// let angle = atan2(this.middleBlock.yOff - current.yOff, this.middleBlock.xOff - current.xOff) + HALF_PI*amount;
			let angle = atan2(current.yOff, current.xOff) + HALF_PI*amount;
			let newX = round(cos(angle)*dist);
			let newY = round(sin(angle)*dist);
			if (newX + current.x > 9 || newX + current.x < 0 ||	newY + current.y <= 0 || (gameGrid[newY + current.y][newX + current.x] != null && !current.figure.blockInFigure(newX + current.x, newY + current.y))) {

				return;
			}
			positions.push([newX, newY]);
		}
		for (let i = 0; i < this.blocks.length; i++) {
			this.blocks[i].xOff = positions[i][0];
			this.blocks[i].yOff = positions[i][1];

		}

		this.edges();
		this.move(this.x, this.y);

    pop();
	}

	move(x, y) {
		this.blocks.forEach(block => {
			block.move(x, y);
		});
		this.blocks.forEach(block => {
			gameGrid[block.y][block.x] = block;
		});
		this.x = x;
		this.y = y;
	}

	draw() {
		this.blocks.forEach(block => {
			block.draw();
		});
	}

}
