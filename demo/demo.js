let video = document.getElementById("myvideo")
video.width = 500
video.height = 400
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

function startVideo() {
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

startVideo()

let model
const modelParams = {
    scoreThreshold: 0.5,
    modelType: "ssdlitemobilenetv2",
    flipHorizontal: true,
}

function runDetection(){
    model.detect(video).then(predictions => {
        // console.log('Predictions: ', predictions);
        model.renderPredictions(predictions, canvas, context, video)
        // console.log("FPS", model.getFPS())
        $("#fps").text("FPS: " + model.getFPS())
        requestAnimationFrame(runDetection)
    });
}
handTrack.load(modelParams).then(md => {
    model = md
    console.log(video)
    runDetection()
    
});