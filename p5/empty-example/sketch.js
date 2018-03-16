let capture;
let w = 640;
let h = 480;

let brightestPosX = 0;
let brightestPosY = 0;

let targets = [{r: 255, g: 0, b: 0}, {r: 0, g: 0, b: 255}];
let border = 100;
let clickCount = 0;

function setup() {
    createCanvas(w, h);
    frame = createCapture({
      video: null
    });
    //scale(-1.0,1.0);
    frame.hide();
    frameRate(30);
    //capture.hide();
    frame.size(w, h);

    //createCanvas(w, h);
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
                strokeWeight(4.0);
                stroke(0);
                ellipse(avgX[j], avgY[j], 20, 20);
            }
        }

    }
    frame.updatePixels();
}

function distSq(x1, y1, z1, x2, y2, z2){
  let d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) +(z2-z1)*(z2-z1);
  return d;

}
