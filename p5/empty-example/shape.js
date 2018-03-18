let blockSize =32;

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
		this.index = floor(random()*7);
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
		image(images[this.index], this.x*blockSize, this.y*blockSize, blockSize, blockSize);
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
