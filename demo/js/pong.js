const video = document.getElementById("myvideo");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let trackButton = document.getElementById("trackbutton");
let updateNote = document.getElementById("updatenote");

let imgindex = 1
let isVideo = false;
let model = null;
let videoInterval = 100

// video.width = 500
// video.height = 400

$(".pauseoverlay").show()
// $(".overlaycenter").text("Game Paused")
$(".overlaycenter").animate({
    opacity: 1,
    fontSize: "4vw"
}, pauseGameAnimationDuration, function () {});

const modelParams = {
    flipHorizontal: true, // flip e.g for video  
    maxNumBoxes: 1, // maximum number of boxes to detect
    iouThreshold: 0.5, // ioU threshold for non-max suppression
    scoreThreshold: 0.6, // confidence threshold for predictions.
}

function startVideo() {
    handTrack.startVideo(video).then(function (status) {
        console.log("video started", status);
        if (status) {
            updateNote.innerText = "Now tracking"
            isVideo = true
            runDetection()
        } else {
            updateNote.innerText = "Please enable video"
        }
    });
}

function toggleVideo() {
    if (!isVideo) {
        updateNote.innerText = "Starting video"
        startVideo();
    } else {
        updateNote.innerText = "Stopping video"
        handTrack.stopVideo(video)
        isVideo = false;
        updateNote.innerText = "Video stopped"
    }
}



trackButton.addEventListener("click", function () {
    toggleVideo();
});



function runDetection() {
    model.detect(video).then(predictions => {
        // console.log("Predictions: ", predictions);
        // get the middle x value of the bounding box and map to paddle location
        model.renderPredictions(predictions, canvas, context, video);
        if (predictions[0]) {
            let midval = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2)
            gamex = document.body.clientWidth * (midval / video.width)
            updatePaddleControl(gamex)
            console.log('Predictions: ', gamex);

        }
        if (isVideo) {
            setTimeout(() => {
                runDetection(video)
            }, videoInterval);
        }
    });
}

// Load the model.
handTrack.load(modelParams).then(lmodel => {
    // detect objects in the image.
    model = lmodel
    updateNote.innerText = "Loaded Model!"
    trackButton.disabled = false

    $(".overlaycenter").animate({
        opacity: 0,
        fontSize: "0vw"
    }, pauseGameAnimationDuration, function () {
        $(".pauseoverlay").hide()
    });
});

// ===============================

var colors = ["#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900", "#fe4365", "#fc9d9a", "#f9cdad", "#c8c8a9", "#83af9b", "#ecd078", "#d95b43", "#c02942", "#542437", "#53777a", "#556270", "#4ecdc4", "#c7f464", "#ff6b6b", "#c44d58", "#774f38", "#e08e79", "#f1d4af", "#ece5ce", "#c5e0dc", "#e8ddcb", "#cdb380", "#036564", "#033649", "#031634", "#490a3d", "#bd1550", "#e97f02", "#f8ca00", "#8a9b0f", "#594f4f", "#547980", "#45ada8", "#9de0ad", "#e5fcc2", "#00a0b0", "#6a4a3c", "#cc333f", "#eb6841", "#edc951", "#e94e77", "#d68189", "#c6a49a", "#c6e5d9", "#f4ead5", "#3fb8af", "#7fc7af", "#dad8a7", "#ff9e9d", "#ff3d7f", "#d9ceb2", "#948c75", "#d5ded9", "#7a6a53", "#99b2b7", "#ffffff", "#cbe86b", "#f2e9e1", "#1c140d", "#cbe86b", "#efffcd", "#dce9be", "#555152", "#2e2633", "#99173c", "#343838", "#005f6b", "#008c9e", "#00b4cc", "#00dffc", "#413e4a", "#73626e", "#b38184", "#f0b49e", "#f7e4be", "#ff4e50", "#fc913a", "#f9d423", "#ede574", "#e1f5c4", "#99b898", "#fecea8", "#ff847c", "#e84a5f", "#2a363b", "#655643", "#80bca3", "#f6f7bd", "#e6ac27", "#bf4d28", "#00a8c6", "#40c0cb", "#f9f2e7", "#aee239", "#8fbe00", "#351330", "#424254", "#64908a", "#e8caa4", "#cc2a41", "#554236", "#f77825", "#d3ce3d", "#f1efa5", "#60b99a", "#ff9900", "#424242", "#e9e9e9", "#bcbcbc", "#3299bb", "#5d4157", "#838689", "#a8caba", "#cad7b2", "#ebe3aa", "#8c2318", "#5e8c6a", "#88a65e", "#bfb35a", "#f2c45a", "#fad089", "#ff9c5b", "#f5634a", "#ed303c", "#3b8183", "#ff4242", "#f4fad2", "#d4ee5e", "#e1edb9", "#f0f2eb", "#d1e751", "#ffffff", "#000000", "#4dbce9", "#26ade4", "#f8b195", "#f67280", "#c06c84", "#6c5b7b", "#355c7d", "#1b676b", "#519548", "#88c425", "#bef202", "#eafde6", "#bcbdac", "#cfbe27", "#f27435", "#f02475", "#3b2d38", "#5e412f", "#fcebb6", "#78c0a8", "#f07818", "#f0a830", "#452632", "#91204d", "#e4844a", "#e8bf56", "#e2f7ce", "#eee6ab", "#c5bc8e", "#696758", "#45484b", "#36393b", "#f0d8a8", "#3d1c00", "#86b8b1", "#f2d694", "#fa2a00", "#f04155", "#ff823a", "#f2f26f", "#fff7bd", "#95cfb7", "#2a044a", "#0b2e59", "#0d6759", "#7ab317", "#a0c55f", "#bbbb88", "#ccc68d", "#eedd99", "#eec290", "#eeaa88", "#b9d7d9", "#668284", "#2a2829", "#493736", "#7b3b3b", "#b3cc57", "#ecf081", "#ffbe40", "#ef746f", "#ab3e5b", "#a3a948", "#edb92e", "#f85931", "#ce1836", "#009989", "#67917a", "#170409", "#b8af03", "#ccbf82", "#e33258", "#e8d5b7", "#0e2430", "#fc3a51", "#f5b349", "#e8d5b9", "#aab3ab", "#c4cbb7", "#ebefc9", "#eee0b7", "#e8caaf", "#300030", "#480048", "#601848", "#c04848", "#f07241", "#ab526b", "#bca297", "#c5ceae", "#f0e2a4", "#f4ebc3", "#607848", "#789048", "#c0d860", "#f0f0d8", "#604848", "#a8e6ce", "#dcedc2", "#ffd3b5", "#ffaaa6", "#ff8c94", "#3e4147", "#fffedf", "#dfba69", "#5a2e2e", "#2a2c31", "#b6d8c0", "#c8d9bf", "#dadabd", "#ecdbbc", "#fedcba", "#fc354c", "#29221f", "#13747d", "#0abfbc", "#fcf7c5", "#1c2130", "#028f76", "#b3e099", "#ffeaad", "#d14334", "#edebe6", "#d6e1c7", "#94c7b6", "#403b33", "#d3643b", "#cc0c39", "#e6781e", "#c8cf02", "#f8fcc1", "#1693a7", "#dad6ca", "#1bb0ce", "#4f8699", "#6a5e72", "#563444", "#a7c5bd", "#e5ddcb", "#eb7b59", "#cf4647", "#524656", "#fdf1cc", "#c6d6b8", "#987f69", "#e3ad40", "#fcd036", "#5c323e", "#a82743", "#e15e32", "#c0d23e", "#e5f04c", "#230f2b", "#f21d41", "#ebebbc", "#bce3c5", "#82b3ae", "#b9d3b0", "#81bda4", "#b28774", "#f88f79", "#f6aa93", "#3a111c", "#574951", "#83988e", "#bcdea5", "#e6f9bc", "#5e3929", "#cd8c52", "#b7d1a3", "#dee8be", "#fcf7d3", "#1c0113", "#6b0103", "#a30006", "#c21a01", "#f03c02", "#382f32", "#ffeaf2", "#fcd9e5", "#fbc5d8", "#f1396d", "#e3dfba", "#c8d6bf", "#93ccc6", "#6cbdb5", "#1a1f1e", "#000000", "#9f111b", "#b11623", "#292c37", "#cccccc", "#c1b398", "#605951", "#fbeec2", "#61a6ab", "#accec0", "#8dccad", "#988864", "#fea6a2", "#f9d6ac", "#ffe9af", "#f6f6f6", "#e8e8e8", "#333333", "#990100", "#b90504", "#1b325f", "#9cc4e4", "#e9f2f9", "#3a89c9", "#f26c4f", "#5e9fa3", "#dcd1b4", "#fab87f", "#f87e7b", "#b05574", "#951f2b", "#f5f4d7", "#e0dfb1", "#a5a36c", "#535233", "#413d3d", "#040004", "#c8ff00", "#fa023c", "#4b000f", "#eff3cd", "#b2d5ba", "#61ada0", "#248f8d", "#605063", "#2d2d29", "#215a6d", "#3ca2a2", "#92c7a3", "#dfece6", "#cfffdd", "#b4dec1", "#5c5863", "#a85163", "#ff1f4c", "#4e395d", "#827085", "#8ebe94", "#ccfc8e", "#dc5b3e", "#9dc9ac", "#fffec7", "#f56218", "#ff9d2e", "#919167", "#a1dbb2", "#fee5ad", "#faca66", "#f7a541", "#f45d4c", "#ffefd3", "#fffee4", "#d0ecea", "#9fd6d2", "#8b7a5e", "#a8a7a7", "#cc527a", "#e8175d", "#474747", "#363636", "#ffedbf", "#f7803c", "#f54828", "#2e0d23", "#f8e4c1", "#f8edd1", "#d88a8a", "#474843", "#9d9d93", "#c5cfc6", "#f38a8a", "#55443d", "#a0cab5", "#cde9ca", "#f1edd0", "#4e4d4a", "#353432", "#94ba65", "#2790b0", "#2b4e72", "#0ca5b0", "#4e3f30", "#fefeeb", "#f8f4e4", "#a5b3aa", "#a70267", "#f10c49", "#fb6b41", "#f6d86b", "#339194", "#9d7e79", "#ccac95", "#9a947c", "#748b83", "#5b756c", "#edf6ee", "#d1c089", "#b3204d", "#412e28", "#151101", "#046d8b", "#309292", "#2fb8ac", "#93a42a", "#ecbe13", "#4d3b3b", "#de6262", "#ffb88c", "#ffd0b3", "#f5e0d3", "#fffbb7", "#a6f6af", "#66b6ab", "#5b7c8d", "#4f2958", "#ff003c", "#ff8a00", "#fabe28", "#88c100", "#00c176", "#fcfef5", "#e9ffe1", "#cdcfb7", "#d6e6c3", "#fafbe3", "#9cddc8", "#bfd8ad", "#ddd9ab", "#f7af63", "#633d2e", "#30261c", "#403831", "#36544f", "#1f5f61", "#0b8185", "#d1313d", "#e5625c", "#f9bf76", "#8eb2c5", "#615375", "#ffe181", "#eee9e5", "#fad3b2", "#ffba7f", "#ff9c97", "#aaff00", "#ffaa00", "#ff00aa", "#aa00ff", "#00aaff"]
var colorindex = 0;


let windowXRange, worldXRange = 0
let paddle
let Vec2
let accelFactor

// TestBed Details
windowHeight = $(document).height()
windowWidth = document.body.clientWidth

console.log(windowHeight, windowWidth);

var scale_factor = 10
var SPACE_WIDTH = windowWidth / scale_factor;
var SPACE_HEIGHT = windowHeight / scale_factor;


// Bead Details
var NUM_BEADS = 6
var BEAD_RESTITUTION = 0.7

// Paddle Details
accelFactor = 0.042 * SPACE_WIDTH;




var paddleMap = new Map();
var maxNumberPaddles = 10;
windowHeight = window.innerHeight
windowWidth = window.innerWidth

var bounceClip = new Audio('http://victordibia.com/skyfall/bounce.wav');
bounceClip.type = 'audio/wav';
var enableAudio = false;
var pauseGame = false;
var pauseGameAnimationDuration = 500;

$("input#sound").click(function () {
    enableAudio = $(this).is(':checked')
    soundtext = enableAudio ? "sound on" : "sound off";
    $(".soundofftext").text(soundtext)
});


function updatePaddleControl(x) {
    // gamex = x;
    let mouseX = convertToRange(x, windowXRange, worldXRange);
    let lineaVeloctiy = Vec2((mouseX - paddle.getPosition().x) * accelFactor, 0)
    // paddle.setLinearVelocity(lineaVeloctiy)
    // paddle.setLinearVelocity(lineaVeloctiy)
    lineaVeloctiy.x = isNaN(lineaVeloctiy.x) ? 0 : lineaVeloctiy.x
    paddle.setLinearVelocity(lineaVeloctiy)
    console.log("linear velocity", lineaVeloctiy.x, lineaVeloctiy.y)
}



planck.testbed(function (testbed) {
    var pl = planck;
    Vec2 = pl.Vec2;

    var world = pl.World(Vec2(0, -30));
    var BEAD = 4
    var PADDLE = 5


    var beadFixedDef = {
        density: 1.0,
        restitution: BEAD_RESTITUTION,
        userData: {
            name: "bead",
            points: 3
        }
    };
    var paddleFixedDef = {
        // density : 1.0,
        // restitution : BEAD_RESTITUTION,
        userData: {
            name: "paddle"
        }
    };

    var self;

    testbed.step = tick;
    testbed.width = SPACE_WIDTH;
    testbed.height = SPACE_HEIGHT;

    var playerScore = 0;
    windowXRange = [0, windowWidth]
    worldXRange = [-(SPACE_WIDTH / 2), SPACE_WIDTH / 2]


    var characterBodies = [];
    var paddleBodies = new Map();

    var globalTime = 0;
    var CHARACTER_LIFETIME = 6000

    start()

    $(function () {
        console.log("ready!");
        scoreDiv = document.createElement('div');
        $(scoreDiv).addClass("classname")
            .text("bingo")
            .appendTo($("body")) //main div
    });

    function start() {
        addUI()
    }



    // Remove paddles that are no longer in frame.
    function refreshMap(currentMap) {
        paddleBodies.forEach(function (item, key, mapObj) {
            if (!currentMap.has(key)) {
                world.destroyBody(paddleBodies.get(key).paddle);
                paddleBodies.delete(key)
            }
        });
    }

    world.on('pre-solve', function (contact) {

        var fixtureA = contact.getFixtureA();
        var fixtureB = contact.getFixtureB();

        var bodyA = contact.getFixtureA().getBody();
        var bodyB = contact.getFixtureB().getBody();

        var apaddle = bpaddle = false
        if (fixtureA.getUserData()) {
            apaddle = fixtureA.getUserData().name == paddleFixedDef.userData.name;
        }

        if (fixtureB.getUserData()) {
            bpaddle = fixtureB.getUserData().name == paddleFixedDef.userData.name;
        }
        if (apaddle || bpaddle) {
            // Paddle collided with something
            var paddle = apaddle ? fixtureA : fixtureB;
            var bead = !apaddle ? fixtureA : fixtureB;

            // console.log(paddle, bead);

            setTimeout(function () {
                paddleBeadHit(paddle, bead);
            }, 1);
        }

    })

    function paddleBeadHit(paddle, bead) {
        // console.log("attempting stroke change", bead.getUserData());
        //console.log("bead points ",bead.getUserData().points);
        playClip(bounceClip)
        updateScoreBox(bead.getUserData().points);

    }

    function playClip(clip) {
        if (enableAudio) {
            clip.play()
        }
    }

    function updateScoreBox(points) {
        if (!pauseGame) {
            playerScore += points;
            $(".scorevalue").text(playerScore)
            pointsAdded = points > 0 ? "+" + points : points
            $(".scoreadded").text(pointsAdded)
            $(".scoreadded").show().animate({
                opacity: 0,
                fontSize: "4vw",
                color: "#ff8800"
            }, 500, function () {
                $(this).css({
                    fontSize: "2vw",
                    opacity: 1
                }).hide()
            });
        }
    }

    function pauseGamePlay() {
        pauseGame = !pauseGame
        if (pauseGame) {
            paddle.setLinearVelocity(Vec2(0, 0))
            $(".pauseoverlay").show()
            $(".overlaycenter").text("Game Paused")
            $(".overlaycenter").animate({
                opacity: 1,
                fontSize: "4vw"
            }, pauseGameAnimationDuration, function () {});
        } else {
            paddle.setLinearVelocity(Vec2(3, 0))

            $(".overlaycenter").animate({
                opacity: 0,
                fontSize: "0vw"
            }, pauseGameAnimationDuration, function () {
                $(".pauseoverlay").hide()
            });
        }

    }

    // process mouse move and touch events
    function mouseMoveHandler(event) {
        if (!pauseGame) {
            mouseX = convertToRange(event.clientX, windowXRange, worldXRange);
            if (!isNaN(mouseX)) {
                lineaVeloctiy = Vec2((mouseX - paddle.getPosition().x) * accelFactor, 0)
                paddle.setLinearVelocity(lineaVeloctiy)
                // xdiff = mouseX - paddle.getPosition().x > 0 ? 100 : -100
                // paddle.setPosition(Vec2(mouseX,0))
            }
        } else {

        }
    }

    function addUI() {
        addPaddle()

        // Add mouse movement listener to move paddle
        // Add mouse movement listener to move paddle
        $(document).bind('touchmove touchstart mousemove', function (e) {
            e.preventDefault();
            var touch
            if (e.type == "touchmove") {
                touch = e.originalEvent.touches[0] || e.originalEvent.changedTouches[0];
            } else if (e.type == "touchstart") {
                touch = e.targetTouches[0]
            } else if (e.type == "mousemove") {
                touch = e
            }
            mouseMoveHandler(touch)
        });

        // Add keypress event listener to pause game
        document.onkeyup = function (e) {
            var key = e.keyCode ? e.keyCode : e.which;
            if (key == 32) {
                console.log("spacebar pressed")
                pauseGamePlay()
            }
            if (key == 83) {
                $("input#sound").click()
            }
        }

        var ground = world.createBody();
        var groundY = -(0.3 * SPACE_HEIGHT)
        // ground.createFixture(pl.Edge(Vec2(-(0.95 * SPACE_WIDTH / 2), groundY), Vec2((0.95 * SPACE_WIDTH / 2), groundY)), 0.0);
    }

    function addPaddle() {
        paddle = world.createBody({
            type: "kinematic",
            filterCategoryBits: PADDLE,
            filterMaskBits: BEAD,
            position: Vec2(-(0.4 * SPACE_WIDTH / 2), -(0.25 * SPACE_HEIGHT))
        })
        paddleLines = [
            [1.8, -0.1],
            [1.8, 0.1],
            [1.2, 0.4],
            [0.4, 0.6],
            [-2.4, 0.6],
            [-3.2, 0.4],
            [-3.8, 0.1],
            [-3.8, -0.1]
        ]

        n = 10, radius = SPACE_WIDTH * 0.03, paddlePath = [], paddlePath = []

        paddleLines.forEach(function (each) {
            paddlePath.push(Vec2(radius * each[0], radius * each[1]))
        })

        paddle.createFixture(pl.Polygon(paddlePath), paddleFixedDef)
        paddle.render = {
            fill: '#ff8800',
            stroke: '#000000'
        }
    }

    // Generate Beeds falling from sky
    function generateBeads(numCharacters) {

        for (var i = 0; i < numCharacters; ++i) {
            var characterBody = world.createBody({
                type: 'dynamic',
                filterCategoryBits: BEAD,
                filterMaskBits: PADDLE,
                position: Vec2(pl.Math.random(-(SPACE_WIDTH / 2), (SPACE_WIDTH / 2)), pl.Math.random((0.5 * SPACE_HEIGHT), 0.9 * SPACE_HEIGHT))
            });


            var beadWidthFactor = 0.005
            var beadColor = {
                fill: '#fff',
                stroke: '#000000'
            };

            var fd = {
                density: beadFixedDef.density,
                restitution: BEAD_RESTITUTION,
                userData: {
                    name: beadFixedDef.userData.name,
                    points: 3
                }
            };

            var randVal = Math.random();

            if (randVal > 0.8) {
                //   green ball, + 20
                beadColor.fill = '#32CD32'
                beadWidthFactor = 0.007
                fd.userData.points = 20;
            } else if (randVal < 0.2) {
                //  Red Ball, - 10
                beadWidthFactor = 0.007
                beadColor.fill = '#ff0000'
                fd.userData.points = -10;
            } else {
                // White ball +10
                beadColor.fill = '#fff'
                beadWidthFactor = 0.007
                fd.userData.points = 10;
            }


            var shape = pl.Circle(SPACE_WIDTH * beadWidthFactor);
            characterBody.createFixture(shape, fd);

            characterBody.render = beadColor

            characterBody.dieTime = globalTime + CHARACTER_LIFETIME

            characterBodies.push(characterBody);
        }

    }

    function tick(dt) {

        globalTime += dt;
        if (world.m_stepCount % 80 == 0) {
            if (!pauseGame) {
                generateBeads(NUM_BEADS);
                //console.log("car size", characterBodies.length);
                for (var i = 0; i !== characterBodies.length; i++) {
                    var characterBody = characterBodies[i];
                    //If the character is old, delete it
                    if (characterBody.dieTime <= globalTime) {
                        characterBodies.splice(i, 1);
                        world.destroyBody(characterBody);
                        i--;
                        continue;
                    }

                }
            }
        }
        // wrap(box)
        wrap(paddle)
        paddleBodies.forEach(function (item, key, mapObj) {
            stayPaddle(item.paddle)
        });


    }

    function stayPaddle(paddle) {
        var p = paddle.getPosition()

        if (p.x < -SPACE_WIDTH / 2) {
            p.x = -SPACE_WIDTH / 2
            paddle.setPosition(p)
        } else if (p.x > SPACE_WIDTH / 2) {
            p.x = SPACE_WIDTH / 2
            paddle.setPosition(p)
        }
    }

    // Returns a random number between -0.5 and 0.5
    function rand(value) {
        return (Math.random() - 0.5) * (value || 1);
    }

    // If the body is out of space bounds, wrap it to the other side
    function wrap(body) {
        var p = body.getPosition();
        p.x = wrapNumber(p.x, -SPACE_WIDTH / 2, SPACE_WIDTH / 2);
        p.y = wrapNumber(p.y, -SPACE_HEIGHT / 2, SPACE_HEIGHT / 2);
        body.setPosition(p);
    }


    function wrapNumber(num, min, max) {
        if (typeof min === 'undefined') {
            max = 1, min = 0;
        } else if (typeof max === 'undefined') {
            max = min, min = 0;
        }
        if (max > min) {
            num = (num - min) % (max - min);
            return num + (num < 0 ? max : min);
        } else {
            num = (num - max) % (min - max);
            return num + (num <= 0 ? min : max);
        }
    }

    // rest of your code
    return world; // make sure you return the world
});


function convertToRange(value, srcRange, dstRange) {
    // value is outside source range return
    if (value < srcRange[0] || value > srcRange[1]) {
        return NaN;
    }

    var srcMax = srcRange[1] - srcRange[0],
        dstMax = dstRange[1] - dstRange[0],
        adjValue = value - srcRange[0];

    return (adjValue * dstMax / srcMax) + dstRange[0];

}