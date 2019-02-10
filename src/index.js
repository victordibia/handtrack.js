/**
 * @license
 * Copyright 2019 Victor Dibia.
 * Licensed under the MIT License (the "License"); 
 * 
 * =============================================================================
 */



import * as tf from '@tensorflow/tfjs';

let model = null

const MODEL_URL = 'hand/tensorflowjs_model.pb';
const WEIGHTS_URL = 'hand/weights_manifest.json';
const basePath = "hand/"

export async function load(base = basePath) {
  // return new Promise(function (resolve, reject) {
  const objectDetection = new ObjectDetection(base);
  await objectDetection.load();
  return (objectDetection);
  // });

}

export class ObjectDetection {
  // modelPathinput;
  // weightPathinput;
  // model;

  constructor(base) {
    this.modelPath = basePath + "tensorflowjs_model.pb";
    this.weightPath = basePath + "weights_manifest.json";
  }

  async load() {
    this.model = await tf.loadFrozenModel(this.modelPath, this.weightPath);

    // Warmup the model.
    const result = await this.model.executeAsync(tf.zeros([1, 300, 300, 3]));
    result.map(async (t) => await t.data());
    result.map(async (t) => t.dispose());
    console.log("model loaded and warmed up")
  }

  async detect(input) {
    let flipHorizontal = true
    let outputStride = 16
    let imageScaleFactor = 0.7

    const [height, width] = getInputTensorDimensions(input);
    const resizedHeight = getValidResolution(imageScaleFactor, height, outputStride);
    const resizedWidth = getValidResolution(imageScaleFactor, width, outputStride);

    const batched = tf.tidy(() => {
      const imageTensor = tf.fromPixels(input)
      if (flipHorizontal) {
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
        20, // maxNumBoxes
        0.4, // iou_threshold
        0.7 // score_threshold
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

    console.log(predictions)
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
  return [maxes, classes];
}