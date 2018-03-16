let blockSize = 32;

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

	move(x, y) {
		let lastX = this.x;
		let lastY = this.y;
		gameGrid[lastY][lastX] = false;
		this.x = (x + this.xOff);
		this.y = (y + this.yOff);
		gameGrid[y + this.yOff][x + this.xOff] = true;
		
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
		this.furthestX = 0;
		for (let y = 0; y < 2; y++) {
			for (let x = 0; x < 4; x++) {
				if (arr[y][x]) {
					this.blocks.push(new Block(x, y));
					if (this.furthestX < x) {
						this.furthestX = x;
					}
				}
			}
		}	
		this.x = 5;
		this.y = 0;
		this.move(5, 0);
	}

	right() {
		if (this.x < 9 - this.furthestX) {
			this.move(this.x+1, this.y);
		}
	}

	left() {
		if (this.x > 0) {
		this.move(this.x-1, this.y);
		}
	}

	down() {
		if (this.y < 19) {
			this.move(this.x, this.y+1);
		}
	}

	move(x, y) {
		this.blocks.forEach(block => {
			block.move(x, y);
		});
		this.x = x;
		this.y = y;
	}

	draw() { 
		this.blocks.forEach(block => {
			block.draw();
		});
	}

	blockBelow() {
		for (let i = 0; i < this.blocks.length; i++) {
			let current = this.blocks[i];
			if (current.y + 1 == 20 || gameGrid[current.y + 1][current.x]) {
				//if (!gameGrid[current.y+1][current.x] in this.blocks) {
					return true;
				//}
			}
		}
		return false;
	}

}
