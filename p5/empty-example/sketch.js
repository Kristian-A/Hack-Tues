let capture;
let w = 640;
let h = 480;

let brightestPosX = 0;
let brightestPosY = 0;
let target = {
    r: 255,
    g: 0,
    b: 0
};
let border = 50;


function setup() {
    createCanvas(w, h);
    frame = createCapture({
      video: null
    });
    frame.hide();
    frameRate(30);
    //capture.hide();
    frame.size(w, h);

    //createCanvas(w, h);
}

function mousePressed(){
    let x = mouseX;
    let y = mouseY;

    let pixel = frame.pixels[x*y*4];

    target.r = frame.pixels[pixel];
    target.g = frame.pixels[pixel+1];
    target.b = frame.pixels[pixel+2];
}

function draw() {
    image(frame, 0, 0,  w, h);
    frame.loadPixels();

    let avgX = 0;
    let avgY = 0;
    let r2 = target.r;
    let g2 = target.g;
    let b2 = target.b;
    if (frame.pixels.length > 0) {
        let i = 0;
        let count = 0;
        for (var y = 0; y < frame.height; y++) {
            for (var x = 0; x < frame.width; x++) {
                let r1 = frame.pixels[i];
                let g1 = frame.pixels[i+1];
                let b1 = frame.pixels[i+2];
                //frame.updatePixels();

                let d = distSq(r1, g1, b1, r2, g2, b2);

                //console.log(d);
                if(d < border*border){
                  avgX += x;
                  avgY += y;
                  count++;
                }
                // console.log(green);
                // console.log(blue);
                //let current = frame.pixels[loc];
                i += 4;
            }
        }

        if(count > 0) {
            avgX = avgX / count;
            avgY = avgY / count;
            fill(255);
            strokeWeight(4.0);
            stroke(0);
            ellipse(avgX, avgY, 20, 20);
        }
    }
    frame.updatePixels();
}

function distSq(x1, y1, z1, x2, y2, z2){
  let d = (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) +(z2-z1)*(z2-z1);
  return d;

}
