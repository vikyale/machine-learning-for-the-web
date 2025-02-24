let video;
let myBodyPix;
let segment;

const options = {
  "multiplier": 0.25,
  "outputStride": 8, // 8, 16, or 32, default is 16
  "segmentationThreshold": 0.5 // 0 - 1, defaults to 0.5 
};

function setup() {
  createCanvas(600, 400);
  video = createCapture(VIDEO);
  video.size(600, 400);
  video.hide();
  myBodyPix = ml5.bodyPix(video, options, modelReady);
}

function modelReady() {
  console.log('model ready');
  myBodyPix.segment(gotResults);
}

function gotResults(err, results) {
  if (err) console.log(err);
  if (results) {
    // console.log(results);
    segment = results.backgroundMask;
    background(0);
    if (segment) image(segment, 0, 0, 600, 400);
    myBodyPix.segment(gotResults);
  }
}
