let model
let video = document.getElementById("myvideo")
video.width = 450
video.height = 380
let trackStatus = false

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let imgHolder = document.getElementById("imgholder")

handTrack.startVideo(video)

const modelParams = {
    scoreThreshold: 0.8,
    modelType: "ssdlitemobilenetv2",
    flipHorizontal: false,
}

function addStaticImages() {
    for (let index = 1; index <= 10; index++) {
        $imagebox = $("<img class='handimagebox' src= 'images/" + index + ".jpg" + "' data-title= '" + index + "'id='imagesample" + index + "'  />");
        // console.log($imagebox)
        $(".scrollholdbox").append($imagebox)

    }
}

addStaticImages()


function detectImage(img) {
    imgHolder.height = 380
    imgHolder.src = img.src
    runDetection(imgHolder)
}

$(".handimagebox").click(function () {
    detectImage($(this)[0])
})

function runDetection(inputsource) {
    model.detect(inputsource).then(predictions => {
        // console.log('Predictions: ', predictions);
        model.renderPredictions(predictions, canvas, context, inputsource)
        // console.log("FPS", model.getFPS())
        $("#fps").text("FPS: " + model.getFPS())
        if (trackStatus) {

            window.requestAnimationFrame(function () {
                runDetection(inputsource)
            });
        }

    });
}
handTrack.load(modelParams).then(loadedModel => {
    model = loadedModel
    hideLoading("#loading_overlay")
    $("#modelloadinttext").fadeOut()
    $(".buttonbar").fadeIn()
    $("#instruction").fadeIn()
    // runDetection()
    detectImage(document.getElementById("imagesample1"))
});



$("#trackbutton").click(function () {
    if (trackStatus) {
        $(this).text("Video Tracking : Start  >")
        trackStatus = false
    } else {
        $(this).text("Video Tracking : Stop  >")
        trackStatus = true
        runDetection(video)
    }
})

// Show Loading Spinner
function showLoading(element) {
    $(element).fadeIn("slow")
}
// Hide Loading Spinner
function hideLoading(element) {
    $(element).fadeOut("slow")
}