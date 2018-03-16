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
		let lastX = this.x/blockSize;
		let lastY = this.y/blockSize;
		gameGrid[lastY][lastX] = false;
		this.x = (x + this.xOff) * blockSize;
		this.y = (y + this.yOff) * blockSize;
		gameGrid[y + this.yOff][x + this.xOff] = true;
		
	}

	draw() {
		stroke(0);
		fill(255, 0, 0);
		rect(this.x, this.y, blockSize, blockSize);
	}

}

class Figure {

	constructor(arr) {
		this.blocks = [];
		for (let y = 0; y < 2; y++) {
			for (let x = 0; x < 4; x++) {
				if (arr[y][x]) {
					this.blocks.push(new Block(x, y));
				}
			}
		}	
		this.move(5, 0);

	}

	move(x, y) {
		this.blocks.forEach((block) => {
			block.move(x, y);
		});
	}

	draw() { 
		this.blocks.forEach((block) => {
			block.draw();
		});
	}

}
