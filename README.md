## Handtrack.js
 

Handtrack.js is a library for prototyping realtime hand detection (bounding box), directly in the browser. Underneath, it uses a trained convolutional neural network that provides bounding box predictions for the location of hands in an image. The convolutional neural network (ssdlite, mobilenetv2) is trained using the tensorflow object detection api ([see here](https://github.com/victordibia/handtracking/issues)).

The library is provided as a useful wrapper to allow you prototype hand/gesture based interactions in your web applications. without the need to understand. It takes in a html image element (<img>, <video>, <canvas> elements, for example) and returns an array of bounding boxes, class names and confidence scores.

The library also provides some useful functions (e.g `getFPS` to get FPS, `renderPredictions` to draw bounding boxes on a canvas element), and customizable model parameters.

## Usage
 

You can use the library by including it in a javacript script tag.

```html

<!-- Load the handtrackjs model. -->
<script src="https://cdn.jsdelivr.net/npm/handtrackjs"> </script>

<!-- Replace this with your image. Make sure CORS settings allow reading the image! -->
<img id="img" src="hand.jpg"/>

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
      model.renderPredictions(predictions, canvas, context, img)
    });
  });
</script>
```

## API

####  Loading the model
Once you include the js module, it is available as `handTrack`. You can then load a model with a some optional parameters.

```js

const defaultParams = {
  flipHorizontal: true,   // flip e.g for video 
  imageScaleFactor: 0.7,  // reduce input image size for gains in speed.
  maxNumBoxes: 20,        // maximum number of boxes to detect
  iouThreshold: 0.5,      // ioU threshold for non-max suppression
  scoreThreshold: 0.99,    // confidence threshold for predictions.
}

handTrack.load(modelParams).then(model => {

});

```
Returns a `model` object.

#### Detecting hands
You can detect hands with the model without needing to create a Tensor.
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