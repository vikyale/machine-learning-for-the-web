// Porting XOR with tf.js to ml5!
// https://youtu.be/N3ZnNa01BPM

let model;
let resolution = 20;
let cols;
let rows;

function setup() {
  createCanvas(400, 400);
  cols = width / resolution;
  rows = height / resolution;

  let index = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let br = 255; //y_values[index] * 255
      fill(br);
      rect(i * resolution, j * resolution, resolution, resolution);
      fill(255 - br);
      textSize(8);
      textAlign(CENTER, CENTER);
      text(nf(0.5, 1, 2), i * resolution + resolution / 2, j * resolution + resolution / 2)
      //text(nf(y_values[index], 1, 2), i * resolution + resolution / 2, j * resolution + resolution / 2)
      index++;
    }
  }

  let options = {
    inputs: 2,
    outputs: 1,
    learningRate: 0.25,
    debug:true
    // hiddenUnits: 2
  }
  model = ml5.neuralNetwork(options);

  //model = ml5.neuralNetwork(2, 1);
  model.addData([0, 0], [0]);
  model.addData([1, 0], [1]);
  model.addData([0, 1], [1]);
  model.addData([1, 1], [0]);

  model.normalizeData();
  model.train({ epochs: 50 }, whileTraining, finishedTraining);
}


function whileTraining(epoch, logs) {
  console.log(`Epoch: ${epoch} - loss: ${logs.loss.toFixed(2)}`);
}

function finishedTraining() {
  // console.log('done!');
  // TODO: Support prediction on multiple rows of input data
  let xs = [];
  console.log('cols: ', cols)
  console.log('rows: ', rows)
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let x1 = i / cols;
      let x2 = j / rows;
      console.log('x1', x1, 'x2', x2)
      xs.push([x1, x2]);
    }
  }
  model.predictMultiple(xs, gotResults);
  // model.predict([1, 0], gotResults);
}

function gotResults(error, results) {
  background(0);
  if(error){
    console.log(err)
    return
  }
  // console.log(results);
  let index = 0;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      let br = results[index][0].value * 255; //y_values[index] * 255
      fill(br);
      rect(i * resolution, j * resolution, resolution, resolution);
      fill(255 - br);
      textSize(8);
      textAlign(CENTER, CENTER);
      // text(nf(0.5, 1, 2), i * resolution + resolution / 2, j * resolution + resolution / 2)
      text(nf(results[index][0].value, 1, 2), i * resolution + resolution / 2, j * resolution + resolution / 2)
      index++;
    }
  }

  // finishedTraining()
}
