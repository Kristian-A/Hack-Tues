let capture;
let w = 640;
let h = 480;

let record = 200;
let brightestPosX = 0;
let brightestPosY = 0;
let target = {
    r: 0,
    g: 200,
    b: 0
};

let currentColor;

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

function draw() {
    image(frame, 0, 0, w, h);
    frame.loadPixels();
    let r2 = target.r;
    let g2 = target.g;
    let b2 = target.b;
    if (frame.pixels.length > 0) {
        for (var x = 0; x < frame.width; x++) {
            for (var y = 0; y < frame.height; y++) {
                let loc = x + y * frame.width;

                var current = frame.pixels[loc];
                // let r1 = red(current);
                // let b1 = blue(current);
                // let g1 = green(current);

                //let distance = dist(red(current), r2, green(current), g2, blue(current), b2);
                //let g1 = green(current);
                // if (1 > record) {
                //     record = 1;
                //     brightestPosX = x;
                //     brightestPosY = y;
                // }
                // fill(255);
                // strokeWeight(4.0);
                // stroke(0);
                // ellipse(brightsestPosX, brightestPosY, 20, 20);
            }
        }
    }
}
