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

	constructor(xOff, yOff) {
		this.xOff = xOff;
		this.yOff = yOff;
		this.x = xOff;
		this.y = yOff;
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
		this.rightX = 0;
		this.leftX = 4;
		for (let y = 0; y < 2; y++) {
			for (let x = 0; x < 4; x++) {
				if (arr[y][x]) {
					this.blocks.push(new Block(x, y));
					if (this.rightX < x) {
						this.rightX = x;
					}
					if (this.leftX > x) {
						this.leftX = x;
					}
				}
			}
		}	
		this.x = 5;
		this.y = 0;
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
			if (this.x == 9 - this.rightX || gameGrid[current.y][current.x+1] != null) {
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
			if (this.x == this.leftX || gameGrid[current.y][current.x-1] != null) {
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
