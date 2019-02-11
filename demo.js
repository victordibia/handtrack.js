let model
let video = document.getElementById("myvideo")
video.width = 450
video.height = 380
let trackStatus = false

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

let imgHolder = document.getElementById("imgholder")

// flipCheckbox = document.querySelector("[data-dropdown]")
// layerModal = CarbonComponents.Dropdown.create(layerModalSelector)

handTrack.startVideo(video)

let modelParams = {
    scoreThreshold: 0.8, 
    flipHorizontal: false,
}

function addStaticImages() {
    for (let index = 1; index <= 15; index++) {
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
    $(".handimagebox").removeClass("handimageselected")
    $(this).addClass("handimageselected")
    self = $(this)[0]

    if (trackStatus) {
        trackStatus = false;
        setTimeout(function () {
            detectImage(self)
        }, 200)
    } else {
        detectImage(self)
    }


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
    // $("#instruction").fadeIn()
    // runDetection()
    $("#imagesample1").click()
    // console.log(model.getModelParameters())
});

$('#confidencerange').on('input', function() {
    score = ($('#confidencerange').val()/100).toFixed(2);
    $('.confidencethreshold').html(score);
    modelParams.scoreThreshold = score
    model.setModelParameters(modelParams)
  });

$('#flipimagecheckbox').change(function () {
    if ($(this).is(":checked")) {
        modelParams.flipHorizontal = true
    } else {
        modelParams.flipHorizontal = false
    }
    // console.log(modelParams)
    model.setModelParameters(modelParams)
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