let capture;
let w = 640;
let h = 640;

let brightestPosX = 0;
let brightestPosY = 0;

let targets = [{r: 255, g: 0, b: 0}, {r: 0, g: 0, b: 255}];
let border = 50;
let clickCount = 0;

let maxDifference = 200;
let rotationThreshhold = 35;
let zeroingThreshhold = 25  ;
let rotated = false;

let dropTrigger = 0.70 * (h-180);
let dropReset = 0.50 * (h-180);
let dropped = false;

let gameGrid = [];
let currentFigure;
let tickTimer;
let score = 0;
let pressedS = false;
let gameOver = false;
let ableLeft = true;
let ableRight = true;

let images = [];

// for (int i = 1; i <= 7; i++) {
//     images[i] = loadImage('./image' + i + '.png');
// }

function setup() {
    createCanvas(w+320, h);
    //images = loadImage("../Assets/blocks/image1.png");
    for (let i = 0; i < 7; i++) {
        images[i] = loadImage("../Assets/blocks/image" + i + ".png");
    }
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
    let pic = images[floor(random()*7)];
	let currentTime = new Date().getTime()
	if (currentTime - tickTimer.getTime() > 800) {
		tickTimer.setTime(currentTime);
		if (currentFigure.blockDown()) {
            if(gameOver){
                gameGrid = [];
                gameGrid = multArr(20, 10);
            	gameGrid.forEach((layer) => {
            		layer.fill(null);
            	});

            }
            else {
                currentFigure = new Figure(random(figuresPreset));
            }
            //console.table(gameGrid);
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

    if(pressedS){
        if(!currentFigure.blockDown()) {
            currentFigure.down();
        }
        else{
            pressedS = false;
        }
    }

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
    //console.log(column);
    ///console.log(currentFigure.y);
    if((column-1) - currentFigure.x > 0){
      if(ableRight && !pressedS && !currentFigure.blockDown()){
        currentFigure.move(column-1, currentFigure.y);
      }
    }

    else if((column-1) - currentFigure.x < 0){
      if(ableLeft && !pressedS && !currentFigure.blockDown()){
        currentFigure.move (column-1, currentFigure.y);
      }
    }
    //currentFigure.move(column-1, currentFigure.y);
    if(currentFigure.blockLeft()){
      ableLeft = false;
    }
    else if (currentFigure.blockRight()) {
      ableRight = false;
      ableLeft = true;
    }
    else{
      ableRight = true;
      ableLeft = true;
    }


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
    if(!pressedS && !currentFigure.blockDown()){
      if (!rotated) {
          if (angle > rotationThreshhold) {
              console.log(rotation);
              if (rotation == "cw") {
                  currentFigure.rotate(1);
              } else {
                  currentFigure.rotate(-1);
              }
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
    }

    stroke(255,100);
    if (!dropped) {
        if (avgPoint.y > dropTrigger) {
            console.log("Trigger");
            dropped = true;
            pressedS = true;
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

    for (var i = 0; i < gameGrid[1].length; i++) {
        if(gameGrid[1][i] != null && currentFigure.blockDown() && !gameOver){
            gameOver = true;
            console.log("rip");
        }
    }

    frame.updatePixels();
}


function keyTyped() {
	if (key == "d") {
		currentFigure.right();
	} else if (key == "a") {
		currentFigure.left();
	} else if (key == "s") {
		pressedS = true;
	} else if (key == "q") {
		currentFigure.rotate(1);
	} else if (key == "e") {
		currentFigure.rotate(-1);
	} else if (key == "r") {
        gameOver = false;
    }

	return false;
}


function distSq(x1, y1, z1, x2, y2, z2) {
  let d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) +(z2-z1)*(z2-z1);
  return d;

}
