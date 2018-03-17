let capture;
let w = 640;
let h = 480;

let brightestPosX = 0;
let brightestPosY = 0;


let targets = [{r: 255, g: 0, b: 0}, {r: 0, g: 0, b: 255}];
let border = 75;
let clickCount = 0;

let maxDifference = 200;
let rotationThreshhold = 45;
let zeroingThreshhold = 30  ;
let rotated = false;

let dropTrigger = 0.70 * h;
let dropReset = 0.50 * h;
let dropped = false;

function setup() {
    createCanvas(w, h);
    frame = createCapture({
      video: null
    });
    //scale(-1.0,1.0);
    frame.hide();
    // frameRate(30);
    //capture.hide();
    frame.size(w, h);
}

function mousePressed(){
    let x = mouseX;
    let y = mouseY;
    let pixel = (y*frame.width + x) * 4;
    let current = clickCount % 2;
    targets[current].r = frame.pixels[pixel];
    targets[current].g = frame.pixels[pixel+1];
    targets[current].b = frame.pixels[pixel+2];
    clickCount++;
}

function draw() {
    // translate(width,0);
    // scale(-1.0,1.0);
    angleMode(DEGREES);
    image(frame, 0, 0,  w, h);
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

    let column = ceil(avgPoint.x / (width/10));
    //console.log(column);

    fill(255, 100);
    noStroke();
    rect((column-1)*(width/10), 0, width/10, height);

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
        line((width/10)*i ,0 , (width/10)*i, height);
    }

    frame.updatePixels();
}

function distSq(x1, y1, z1, x2, y2, z2) {
  let d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) +(z2-z1)*(z2-z1);
  return d;

}
