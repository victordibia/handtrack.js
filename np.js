const tf = require('@tensorflow/tfjs')


const MODEL_URL = 'hand/tensorflowjs_model.pb';
const WEIGHTS_URL = 'hand/weights_manifest.json';


function loadModel() {

    model = tf.loadFrozenModel(MODEL_URL, WEIGHTS_URL);
    console.log(model)
    // const cat = document.getElementById('image');

    // console.log("We laoded image")

    // const batched = tf.tidy(() => {
    //   const img = tf.fromPixels(cat)
    //   // console.log(img)
    //   // Reshape to a single-element batch so we can pass it to executeAsync.
    //   return img.expandDims(0)
    // })
    // console.log(batched)
    // model.executeAsync(batched);
    // model.executeAsync(batched).then(result => { })
    // console.log(res)
}

loadModel()