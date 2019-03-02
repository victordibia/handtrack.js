## Handtrack.js
 
> View a live demo in your [browser here](https://victordibia.github.io/handtrack.js/).

<img src="demo/images/banner.jpg" style="width:100%">

Handtrack.js is a library for prototyping realtime hand detection (bounding box), directly in the browser. Underneath, it uses a trained convolutional neural network that provides bounding box predictions for the location of hands in an image. The convolutional neural network (ssdlite, mobilenetv2) is trained using the tensorflow object detection api ([see here](https://github.com/victordibia/handtracking/issues)).

> This work is based on the [the coco-ssd tensorflowjs](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd) sample. Definitely check it out if you are interested in detecting/tracking any of the 90 classes in the coco dataset.

The library is provided as a useful wrapper to allow you prototype hand/gesture based interactions in your web applications. without the need to understand. It takes in a html image element (`img`, `video`, `canvas` elements, for example) and returns an array of bounding boxes, class names and confidence scores.

The library also provides some useful functions (e.g `getFPS` to get FPS, `renderPredictions` to draw bounding boxes on a canvas element), and customizable model parameters.

> Tests on a Macbook Pro 2.2 GHz Intel Core i7, achieve 21 FPS.

## How does this work?


- Trained using egohands dataset. You will notice the  model works better in egohands view.
- It only predicts the hand but does not predict if open or closed.


## Usage
 
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
npm install handtrackjs
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
- `model.renderPredictions(predictions, canvas, context, mediasource)`:  draw bounding box (and the input mediasource image) on the specified canvas.
- `model.getModelParameters()`: returns model parameters.
- `model.setModelParameters()`: updates model parameters.
- `dispose()` : delete model instance
- `startVideo(video)` : start camera video stream on given video element. Returns a promise that can be used to validate if user provided video permission.
- `stopVideo(video)` : stop video stream.


## How was this built?

The object detection model used in this project was trained using annotated images of the human hand ([see here](https://github.com/victordibia/handtracking/issues)) and converted to the tensorflow.js format. This wrapper library was created using guidelines and some code adapted from [the coco-ssd tensorflowjs](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd).