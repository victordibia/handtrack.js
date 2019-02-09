/**
 * @license
 * Copyright 2019 Victor Dibia.
 * Licensed under the MIT License (the "License"); 
 * 
 * =============================================================================
 */



import * as tf from '@tensorflow/tfjs';
import 'babel-polyfill';  

let model = null
let video = null

const c = document.getElementById('canvas');
const context = c.getContext('2d');

video = document.getElementById("myvideo")
video.width = 500 ;
video.height = 400 ;
 

const MODEL_URL = 'hand/tensorflowjs_model.pb';
const WEIGHTS_URL = 'hand/weights_manifest.json';




async function loadModel() {
  model = await tf.loadFrozenModel(MODEL_URL, WEIGHTS_URL);
  const cat = document.getElementById('image');
  console.log("Model loaded")
}


/*
* Generate bounding box data for each hand.
* Code adapted from cocos-ssd tensorflow model: https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd 
*/
async function detect(video, modelParams) { 
  modelParams.maxNumBoxes = modelParams.maxNumBoxes || 20
  modelParams.iouThreshold = modelParams.iouThreshold || 0.5
  modelParams.scoreThreshold = modelParams.scoreThreshold || 0.6


  const batched = tf.tidy(() => {
    const img = tf.fromPixels(video) 
    return img.expandDims(0)
  })

  const height = batched.shape[1]
  const width = batched.shape[2]

  model.executeAsync(batched).then(result => {

    const boxes = result[0].dataSync()
    const scores = result[1].dataSync()
    const labels = result[2].dataSync()
    const last = result[3].dataSync()

    // clean the webgl tensors
    batched.dispose()
    tf.dispose(result)

    const prevBackend = tf.getBackend()
    // run post process in cpu
    tf.setBackend('cpu')
    const indexTensor = tf.tidy(() => {
      const boxes2 = tf.tensor2d(boxes, [
        result[0].shape[1],
        result[0].shape[2]
      ])
      return tf.image.nonMaxSuppression(
        boxes2,
        scores,
        modelParams.maxNumBoxes, // maxNumBoxes
        modelParams.iouThreshold, // iou_threshold
        modelParams.scoreThreshold// score_threshold
      )
    })
    const indexes = indexTensor.dataSync()
    indexTensor.dispose()
    // restore previous backend
    tf.setBackend(prevBackend)

    const predictions = buildDetectedObjects(
      width,
      height,
      boxes,
      scores,
      indexes,
      labels
    ) 
    return predictions
  })

}
 
function renderPredictions(result) {
  // context.drawImage(video, 0, 0, canvas.width, canvas.height);
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = video.width;
  canvas.height = video.height;

  context.save();
//   context.scale(-1, 1);
//   context.translate(-video.width, 0);
  context.drawImage(video, 0, 0, video.width, video.height);
  context.restore();
  context.drawImage(video, 0, 0);
  context.font = '10px Arial';

  // console.log('number of detections: ', result.length);
  for (let i = 0; i < result.length; i++) {
    context.beginPath();
    context.rect(...result[i].bbox);
    context.lineWidth = 1;
    context.strokeStyle = 'red';
    context.fillStyle = 'green';
    context.stroke();
    context.fillText(
      result[i].score.toFixed(3) + ' ' + result[i].class, result[i].bbox[0],
      result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10);
  }
}

function buildDetectedObjects(width, height, boxes, scores, indexes, classes) {
  const count = indexes.length
  const objects = []
  for (let i = 0; i < count; i++) {
    const bbox = []
    for (let j = 0; j < 4; j++) {
      bbox[j] = boxes[indexes[i] * 4 + j]
    }
    const minY = bbox[0] * height
    const minX = bbox[1] * width
    const maxY = bbox[2] * height
    const maxX = bbox[3] * width
    bbox[0] = minX
    bbox[1] = minY
    bbox[2] = maxX - minX
    bbox[3] = maxY - minY
    objects.push({
      bbox: bbox,
      class: classes[indexes[i]],
      score: scores[indexes[i]]
    })
  }
  return objects
}
