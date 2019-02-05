/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as cocoSsd from '@tensorflow-models/coco-ssd'
import * as tf from "@tensorflow/tfjs"

import imageURL from './hand3.jpg';
import image2URL from './image2.jpg';

let modelPromise;
let baseModel = 'lite_mobilenet_v2';
let model = null

// window.onload = () => modelPromise = cocoSsd.load();

const MODEL_URL = 'hand/tensorflowjs_model.pb';
const WEIGHTS_URL = 'hand/weights_manifest.json';

async function loadModel() {

  model = await tf.loadFrozenModel(MODEL_URL, WEIGHTS_URL);
  const cat = document.getElementById('image');

  console.log("We laoded image", cat)

  const batched = tf.tidy(() => {
    const img = tf.fromPixels(cat)
    // console.log(img)
    // Reshape to a single-element batch so we can pass it to executeAsync.
    return img.expandDims(0)
  })

  const height = batched.shape[1]
  const width = batched.shape[2]

  model.executeAsync(batched).then(result => {

    const boxes = result[0].dataSync()
    const scores = result[1].dataSync()
    const labels = result[2].dataSync()
    const last = result[3].dataSync()

    console.log(boxes.length, scores.length, labels.length)
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
        20, // maxNumBoxes
        0.6, // iou_threshold
        0.2 // score_threshold
      )
    })
    const indexes = indexTensor.dataSync()
    indexTensor.dispose()
    // restore previous backend
    tf.setBackend(prevBackend)

    console.log(indexes, result[0].shape)
    console.log(scores.length, boxes.length)

    const predictions = buildDetectedObjects(
      width,
      height,
      boxes,
      scores,
      indexes,
      labels
    )

    console.log("Objects found", predictions.length, predictions)
    result = predictions
    const c = document.getElementById('canvas');
    const context = c.getContext('2d');
    context.drawImage(image, 0, 0);
    context.font = '10px Arial';

    console.log('number of detections: ', result.length);
    for (let i = 0; i < result.length; i++) {
      context.beginPath();
      context.rect(...result[i].bbox);
      context.lineWidth = 1;
      context.strokeStyle = 'green';
      context.fillStyle = 'green';
      context.stroke();
      context.fillText(
        result[i].score.toFixed(3) + ' ' + result[i].class, result[i].bbox[0],
        result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10);
    }

  })

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

loadModel()


// alert("bingo")
const button = document.getElementById('toggle');
button.onclick = () => {
  image.src = image.src.endsWith(imageURL) ? image2URL : imageURL;
};

const select = document.getElementById('base_model');
select.onchange = async (event) => {
  const model = await modelPromise;
  model.dispose();
  modelPromise = cocoSsd.load(
    event.srcElement.options[event.srcElement.selectedIndex].value);
};

const image = document.getElementById('image');
image.src = imageURL;

const runButton = document.getElementById('run');
runButton.onclick = async () => {
  const model = await modelPromise;
  console.log('model loaded');
  console.time('predict1');
  const result = await model.detect(image);
  console.timeEnd('predict1');


  const c = document.getElementById('canvas');
  const context = c.getContext('2d');
  context.drawImage(image, 0, 0);
  context.font = '10px Arial';

  console.log('number of detections: ', result.length);
  for (let i = 0; i < result.length; i++) {
    context.beginPath();
    context.rect(...result[i].bbox);
    context.lineWidth = 1;
    context.strokeStyle = 'green';
    context.fillStyle = 'green';
    context.stroke();
    context.fillText(
      result[i].score.toFixed(3) + ' ' + result[i].class, result[i].bbox[0],
      result[i].bbox[1] > 10 ? result[i].bbox[1] - 5 : 10);
  }
};
