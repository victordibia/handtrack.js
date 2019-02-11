/**
 * @license
 * Copyright 2019 Victor Dibia.
 * Handtrack.js - A library for prototyping realtime hand tracking using neural networks.
 * Licensed under the MIT License (the "License"); 
 * Code snippets from the tensorflow coco-ssd example are reused here - https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd
 * =============================================================================
 */


import * as tf from '@tensorflow/tfjs';

const basePath = "https://cdn.jsdelivr.net/npm/handtrackjs/models/web/"

const defaultParams = {
  flipHorizontal: true,
  outputStride: 16,
  imageScaleFactor: 0.7,
  maxNumBoxes: 20,
  iouThreshold: 0.5,
  scoreThreshold: 0.99,
  modelType: "ssdlitemobilenetv2"
}

export async function load(params) {
  let modelParams = Object.assign({}, defaultParams, params);
  // console.log(modelParams) 
  const objectDetection = new ObjectDetection(modelParams);
  await objectDetection.load();
  return (objectDetection);
}

export function startVideo(video){
  video.height = video.height || 400
  video.width = video.width || 500
  navigator.mediaDevices
        .getUserMedia({
            audio: false,
            video: {
                facingMode: "user",
                width: 600,
                height: 500
            }
        })
        .then(stream => {
            // console.log(video)
            video.srcObject = stream
            video.onloadedmetadata = () => {
                // video.play()
            }
        })
}

export class ObjectDetection { 
  constructor(modelParams) {
    this.modelPath = basePath + modelParams.modelType + "/tensorflowjs_model.pb";
    this.weightPath = basePath + modelParams.modelType + "/weights_manifest.json";
    this.modelParams = modelParams
  }

  async load() {
    this.fps = 0
    this.model = await tf.loadFrozenModel(this.modelPath, this.weightPath);

    // Warmup the model.
    const result = await this.model.executeAsync(tf.zeros([1, 300, 300, 3]));
    result.map(async (t) => await t.data());
    result.map(async (t) => t.dispose());
    // console.log("model loaded and warmed up")
  }

  async detect(input) {

    let timeBegin = Date.now()
    const [height, width] = getInputTensorDimensions(input);
    const resizedHeight = getValidResolution(this.modelParams.imageScaleFactor, height, this.modelParams.outputStride);
    const resizedWidth = getValidResolution(this.modelParams.imageScaleFactor, width, this.modelParams.outputStride);

    const batched = tf.tidy(() => {
      const imageTensor = tf.fromPixels(input)
      if (this.modelParams.flipHorizontal) {
        return imageTensor.reverse(1).resizeBilinear([resizedHeight, resizedWidth]).expandDims(0);
      } else {
        return imageTensor.resizeBilinear([resizedHeight, resizedWidth]).expandDims(0);
      }
    })

    const result = await this.model.executeAsync(batched);

    const scores = result[0].dataSync()
    const boxes = result[1].dataSync()

    // clean the webgl tensors
    batched.dispose()
    tf.dispose(result)

    // console.log("scores result",scores, boxes)

    const [maxScores, classes] = calculateMaxScores(scores, result[0].shape[1], result[0].shape[2]);
    const prevBackend = tf.getBackend()
    // run post process in cpu
    tf.setBackend('cpu')
    const indexTensor = tf.tidy(() => {
      const boxes2 = tf.tensor2d(boxes, [
        result[1].shape[1],
        result[1].shape[3]
      ])
      return tf.image.nonMaxSuppression(
        boxes2,
        scores,
        this.modelParams.maxNumBoxes, // maxNumBoxes
        this.modelParams.iouThreshold, // iou_threshold
        this.modelParams.scoreThreshold // score_threshold
      )
    })
    const indexes = indexTensor.dataSync()
    indexTensor.dispose()
    // restore previous backend
    tf.setBackend(prevBackend)

    const predictions = this.buildDetectedObjects(
      width,
      height,
      boxes,
      scores,
      indexes,
      classes
    )
    let timeEnd = Date.now()
    this.fps = Math.round(1000 / (timeEnd - timeBegin))
    
    return predictions

  }

  buildDetectedObjects(width, height, boxes, scores, indexes, classes) {
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

  getFPS() {
    return this.fps;
  }

  renderPredictions(predictions, canvas, context, mediasource) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = mediasource.width;
    canvas.height = mediasource.height;
    // console.log(mediasource.width,mediasource.height)

    context.save();
    if (this.modelParams.flipHorizontal) {
      context.scale(-1, 1);
      context.translate(-mediasource.width, 0);
    }
    context.drawImage(mediasource, 0, 0, mediasource.width, mediasource.height);
    context.restore(); 
    context.font = '10px Arial';

    // console.log('number of detections: ', predictions.length);
    for (let i = 0; i < predictions.length; i++) {
      context.beginPath();
      context.rect(...predictions[i].bbox);
      context.lineWidth = 1;
      context.strokeStyle = 'red';
      context.fillStyle = 'green';
      context.stroke();
      context.fillText(
        predictions[i].score.toFixed(3) + ' ' + predictions[i].class, predictions[i].bbox[0],
        predictions[i].bbox[1] > 10 ? predictions[i].bbox[1] - 5 : 10);
    }

    // Write FPS to top left
    context.font = "bold 15px Arial"
    context.fillText( "FPS: " + this.fps , 10, 20)
  }

  dispose() {
    if (this.model) {
      this.model.dispose();
    }
  }

}



function getValidResolution(imageScaleFactor, inputDimension, outputStride) {
  const evenResolution = inputDimension * imageScaleFactor - 1;
  return evenResolution - (evenResolution % outputStride) + 1;
}

function getInputTensorDimensions(input) {
  return input instanceof tf.Tensor ? [input.shape[0], input.shape[1]] : [input.height, input.width];
}

function calculateMaxScores(scores, numBoxes, numClasses) {
  const maxes = [];
  const classes = [];
  for (let i = 0; i < numBoxes; i++) {
    let max = Number.MIN_VALUE;
    let index = -1;
    for (let j = 0; j < numClasses; j++) {
      if (scores[i * numClasses + j] > max) {
        max = scores[i * numClasses + j];
        index = j;
      }
    }
    maxes[i] = max;
    classes[i] = index;
  }
  // console.log([maxes, classes])
  return [maxes, classes];
}