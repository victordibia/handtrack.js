## Handtrack.js

[![npm version](https://badge.fury.io/js/handtrackjs.svg)](https://badge.fury.io/js/handtrackjs)
![npm](https://img.shields.io/npm/dt/handtrackjs.svg?label=npm%20downloads&style=flat-square)
[![](https://data.jsdelivr.com/v1/package/npm/handtrackjs/badge)](https://www.jsdelivr.com/package/npm/handtrackjs)
 
> View a live demo in your [browser here](https://victordibia.github.io/handtrack.js/).

<img src="demo/images/bossflip.gif" width="100%">



Handtrack.js is a library for prototyping realtime hand detection (bounding box), directly in the browser. Underneath, it uses a trained convolutional neural network that provides bounding box predictions for the location of hands in an image. The convolutional neural network (ssdlite, mobilenetv2) is trained using the tensorflow object detection api ([see here](https://github.com/victordibia/handtracking/issues)).




| FPS | Image Size | Device                             | Browser                  | Comments |
|-----|------------|------------------------------------|--------------------------|----------|
| 21  | 450 * 380  | Macbook Pro (i7, 2.2GHz, 2018)     | Chrome Version 72.0.3626 |  --      |
| 14  | 450 * 380  | Macbook Pro (i7, 2.2GHz, mid 2014) | Chrome Version 72.0.3626 |  --      |


> This work is based on the [the coco-ssd tensorflowjs](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) sample. Definitely check it out if you are interested in detecting/tracking any of the 90 classes in the coco dataset.

The library is provided as a useful wrapper to allow you prototype hand/gesture based interactions in your web applications. without the need to understand. It takes in a html image element (`img`, `video`, `canvas` elements, for example) and returns an array of bounding boxes, class names and confidence scores.

The library also provides some useful functions (e.g `getFPS` to get FPS, `renderPredictions` to draw bounding boxes on a canvas element), and customizable model parameters.

> Tests on a Macbook Pro 2.2 GHz Intel Core i7, achieve 21 FPS.

## How does this work?
<img src="demo/images/architecture.jpg" width="100%">

- Trained using egohands dataset. You will notice the  model works better when the hands in an image is viewed from a top (egocentic) view.
- Trained model is converted to the Tensorflowjs format
- Model is wrapped into an npm package, and can be accessed using [jsdelivr](https://www.jsdelivr.com/package/npm/handtrackjs), a free open source cdn that lets you include any npm package in your web application. You may notice the model is loaded slowly the first time the page is opened but gets faster on subsequent loads (caching).

## When Should I Use Handtrack.js



<img src="demo/images/doodle.gif" width="100%">

If you are interested in prototyping gesture based (body as input) interactive experiences, Handtrack.js can be useful. The usser does not need to attach any additional sensors or hardware but can immediately take advantage of engagement benefits that result from gesture based and body-as-input interactions.

Some (not all) relevant scenarios are listed below: 

- When mouse motion can be mapped to hand motion for control purposes.
- When an overlap of hand and other objects can represent meaningful interaction signals (e.g a touch or selection event for an object).
- Scenarios where the human hand motion can be a proxy for activity recognition (e.g. automatically tracking movement activity from a video or images of individuals playing chess). Or simply counting how many humans are present in an image or video frame.
- You want an accessible demonstration that anyone can easily run or tryout with minimal setup.


## How Do I Use Handtrack.js in my Web App?
 
### via Script Tag

You can use the library by including it in a javacript script tag.

```html

<!-- Load the handtrackjs model. -->
<script src="https://cdn.jsdelivr.net/npm/handtrackjs/dist/handtrack.min.js"> </script>

<!-- Replace this with your image. Make sure CORS settings allow reading the image! -->
<img id="img" src="hand.jpg"/> 
<canvas id="canvas" class="border"></canvas>

<!-- Place your code in the script tag below. You can also use an external .js file -->
<script>
  // Notice there is no 'import' statement. 'handTrack' and 'tf' is
  // available on the index-page because of the script tag above.

  const img = document.getElementById('img'); 
  const canvas = document.getElementById('canvas');
  const context = canvas.getContext('2d');
  
  // Load the model.
  handTrack.load().then(model => {
    // detect objects in the image.
    model.detect(img).then(predictions => {
      console.log('Predictions: ', predictions); 
    });
  });
</script>
```

### via NPM

```shell
npm install --save handtrackjs
```

```js
import * as handTrack from 'handtrackjs';

const img = document.getElementById('img');

// Load the model.
handTrack.load().then(model => {
  // detect objects in the image.
  console.log("model loaded")
  model.detect(img).then(predictions => {
    console.log('Predictions: ', predictions); 
  });
});
```



## API

####  Loading the model: handTrack.load()
Once you include the js module, it is available as `handTrack`. You can then load a model with optional parameters.

```js

const modelParams = {
  flipHorizontal: true,   // flip e.g for video 
  imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
  maxNumBoxes: 20,        // maximum number of boxes to detect
  iouThreshold: 0.5,      // ioU threshold for non-max suppression
  scoreThreshold: 0.79,    // confidence threshold for predictions.
}

handTrack.load(modelParams).then(model => {

});

```
Returns a `model` object.

#### Detecting hands: model.detect()
`model.detect` takes an input image element (can be an `img`, `video`, `canvas` tag) and returns an array of bounding boxes with class name and confidence level.

```js
model.detect(img).then(predictions => { 
        
});
```

Returns an array of classes and confidence scores that looks like:

```js
[{
  bbox: [x, y, width, height],
  class: "hand",
  score: 0.8380282521247864
}, {
  bbox: [x, y, width, height],
  class: "hand",
  score: 0.74644153267145157
}]
```

#### Other Helper Methods

- `model.getFPS()` : get FPS calculated as number of detections per second.
- `model.renderPredictions(predictions, canvas, context, mediasource)`:  draw bounding box (and the input mediasource image) on the specified canvas. `predictions` are an array of results from the `detect()` method. `canvas` is a reference to a html canvas object where the predictions should be rendered, `context` is the canvas 2D context object, `mediasource` a reference to the input frame (img, video, canvas etc) used in the prediction (it is first rendered, and the bounding boxes drawn on top of it).
- `model.getModelParameters()`: returns model parameters.
- `model.setModelParameters(modelParams)`: updates model parameters with [`modelParams`](#loading-the-model-handtrackload)
- `dispose()` : delete model instance
- `startVideo(video)` : start webcam video stream on given video element. Returns a promise that can be used to validate if user provided video permission.
- `stopVideo(video)` : stop video stream.


## How was this built?

The object detection model used in this project was trained using annotated images of the human hand ([see here](https://github.com/victordibia/handtracking/issues)) and converted to the tensorflow.js format. This wrapper library was created using guidelines and some code adapted from [the coco-ssd tensorflowjs](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd).


## TODO (ideas welcome)

- This thing is still compute heavy (you will hear your fans start spinning like crazy after a few mins). This is mainly because of the neural net operations needed to predict bounding boxes. Perhaps there might be ways to improve/optimize this.
- Tracking id's across frames. Perhaps some nifty methods that assigns ids to each had as they enter a frame and tracks them (e.g based on naive euclidean distance).
- Add some discrete poses (e.g. instead of just hand, detect open hand, fist).

