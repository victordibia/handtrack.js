let model
let video = document.getElementById("myvideo") 
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

handTrack.startVideo(video) 

const modelParams = {
    scoreThreshold: 0.8,
    modelType: "ssdlitemobilenetv2",
    flipHorizontal: true,
}

function runDetection() {
    model.detect(video).then(predictions => {
        // console.log('Predictions: ', predictions);
        model.renderPredictions(predictions, canvas, context, video)
        // console.log("FPS", model.getFPS())
        $("#fps").text("FPS: " + model.getFPS())
        requestAnimationFrame(runDetection)
    });
}
handTrack.load(modelParams).then(loadedModel => {
    model = loadedModel
    runDetection()
});