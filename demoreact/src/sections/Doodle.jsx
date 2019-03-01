import React, { Component } from "react";
import { Button } from 'carbon-components-react';
import { ChromePicker } from 'react-color'
import * as handTrack from "handtrackjs"

class Doodle extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modelParams: {
                scoreThreshold: 0.9,
                flipHorizontal: false,
                maxNumBoxes:1
            },
            model: null,
            modelLoaded: false,
            videoPlayStatus: false,
            showHighlight: false,
            highlightText: "Attention needed",
            doodlecolor: "#1780DC"
        }

        this.canvas = React.createRef();
        this.videoButton = React.createRef();
        this.imgHolder = React.createRef();
        this.video = React.createRef();

    }
    componentWillUnmount() {
        console.log("Page unmounting disposing model")
        // this.state.model.dispose()
    }

    handleChangeComplete = (color) => {
        this.setState({ doodlecolor: color.hex });
    };

    componentDidMount() {
        this.video.current.width = 450
        this.video.current.height = 380;

        this.canvasContext = this.canvas.current.getContext('2d')
        this.DoodleCenter = true
        console.log(this.canvas.current)
        handTrack.load(this.state.modelParams).then(loadedModel => {
            this.setState({ model: loadedModel })
            this.setState({ modelLoaded: true })
            // console.log("model loaded", this.state)
            // document.getElementsByClassName("handimagebox")[0].click()
            this.setState({ modelLoaded: true })
        });

    }

    runDetection(inputsource) {
        let self = this
        this.state.model.detect(inputsource).then(predictions => {

            // if (predictions[0]) {
            //     let midval = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2)
            //     console.log('Predictions: ', inputsource.width, midval / inputsource.width);

            // }
            if (this.canvas.current) {
                this.runDrawPredictions(predictions, this.canvas.current, this.canvasContext, inputsource)
                // console.log("FPS", model.getFPS())
                // $("#fps").text("FPS: " + model.getFPS())
                if (this.state.videoPlayStatus && inputsource) {
                    window.requestAnimationFrame(function () {
                        self.runDetection(inputsource)
                    });
                }
            }

        });
    }

    runDrawPredictions(predictions, canvas, context, mediasource) {
        // context.clearRect(0, 0, canvas.width, canvas.height);
        canvas = this.canvas.current
        context = this.canvasContext
        canvas.width = mediasource.width;
        canvas.height = mediasource.height;
        // console.log(mediasource.width,me diasource.height)

        context.save();
        if (this.state.modelParams.flipHorizontal) {
            context.scale(-1, 1);
            context.translate(-mediasource.width, 0);
        }
        // context.drawImage(mediasource, 0, 0, mediasource.width, mediasource.height);
        context.restore();
        context.font = '10px Arial';

        // console.log('number of detections: ', predictions.length);
        for (let i = 0; i < predictions.length; i++) {
            // context.beginPath();
            context.fillStyle = this.state.doodlecolor;
            // context.fillRect(predictions[i].bbox[0], predictions[i].bbox[1] - 17, predictions[i].bbox[2], 17)
            // context.rect(...predictions[i].bbox);

            // draw a dot at the center of bounding box

            context.lineWidth = 1;
            context.strokeStyle = this.state.doodlecolor;
            context.fillStyle = this.state.doodlecolor// "rgba(244,247,251,1)";
            context.fillRect(predictions[i].bbox[0] + (predictions[i].bbox[2] / 2), predictions[i].bbox[1] + (predictions[i].bbox[3] / 2), 5, 5)

            context.stroke();
            // context.fillText(
            //     predictions[i].score.toFixed(3) + ' ' + " | hand",
            //     predictions[i].bbox[0] + 5,
            //     predictions[i].bbox[1] > 10 ? predictions[i].bbox[1] - 5 : 10);
        }


    }

    detectImage(img) {
        this.imgHolder.current.height = 380
        this.imgHolder.current.src = img.src
        this.runDetection(this.imgHolder.current)
    }

    updateConfidence(e) {

        let modelParams = this.state.modelParams
        modelParams.scoreThreshold = e.target.value / 100
        this.setState({ modelParams })

        this.state.model.setModelParameters(this.state.modelParams)
        let selectedBox = document.getElementsByClassName("handimageselected")[0]
        if (!this.state.videoPlayStatus && selectedBox) {
            selectedBox.click()
        }

    }

    videoButtonClick(e) {
        let self = this
        if (this.state.videoPlayStatus) {
            this.setState({ videoPlayStatus: false })
            handTrack.stopVideo()
        } else {
            handTrack.startVideo(this.video.current).then(function (status) {

                if (status) {
                    self.setState({ videoPlayStatus: true })
                    self.runDetection(self.video.current)
                } else {
                    console.log("Camera not available")
                    self.setState({ highlightText: "Please enable camera to use video detection" })
                    self.setState({ showHighlight: true })
                    setTimeout(() => {
                        self.setState({ showHighlight: false })
                    }, 6000);
                }
            })



        }
    }

    flipImageCheck(e) {
        let modelParams = this.state.modelParams
        modelParams.flipHorizontal = e.target.checked
        this.setState({ modelParams })
        this.state.model.setModelParameters(this.state.modelParams)
        console.log(this.state)
    }

    clickImage(e) {

        let els = document.getElementsByClassName("handimagebox")
        for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('handimageselected');
        }
        e.target.classList.add("handimageselected")

        if (this.state.videoPlayStatus) {
            let self = this
            let target = e.target
            document.getElementById("videobutton").click()
            setTimeout(function () {
                self.detectImage(target)
            }, 200)
        } else {
            this.detectImage(e.target)
        }

    }

    render() {


        return (
            <div className="">

                <div className="pagetitle">Doodle</div>
                <br />
                {this.state.modelLoaded ? null : <Loading />}

                <div className="clickable ">
                    <div className={this.state.modelLoaded ? "hidden" : "disableoverlay"}></div>
                    <div className={this.state.showHighlight ? "orangehighlight mb10" : "hidden"}> {this.state.highlightText}</div>
                    <div className="bluehightlight mb10">
                        All detection is done in the browser! <span className="lighttext"> Click on an image or  Start video</span>
                    </div>
                    <div>
                        <Button id="videobutton" onClick={this.videoButtonClick.bind(this)} >  {this.state.videoPlayStatus ? "▩ Stop Video Doodle" : " ▶ ️ Start Video Doodle"} </Button>

                        <div className="bx--form-item bx--checkbox-wrapper  flipimagecheckbox">
                            <input onClick={this.flipImageCheck.bind(this)} id="flipimagecheckbox" className="bx--checkbox" type="checkbox" value="new" name="checkbox"></input>
                            <label htmlFor="flipimagecheckbox" className="bx--checkbox-label"> Flip Image </label>
                        </div>
                    </div>
                    <div className="flex9 ">
                        <div id="instruction" className="lighttext mt10">Modify confidence score threshold.</div>
                        <div className="mt10 flex">
                            <div className="slidecontainer flexfull ">
                                <input type="range" val={this.state.modelParams.scoreThreshold * 100} onChange={this.updateConfidence.bind(this)} min="1" max="100" className="slider" id="confidencerange"></input>
                            </div>
                            <div className="iblock confidencethreshold ">  {this.state.modelParams.scoreThreshold} </div>
                        </div>
                    </div>
                    <div className="flex mt10">
                        <div className="flex2 mr20  ">
                            <div className="boldtext mb10"> Doodle Color </div>
                            <div style={{ backgroundColor: this.state.doodlecolor }} className="doodlecolor mb10 rad3"></div>
                            <ChromePicker
                                color={this.state.doodlecolor}
                                onChangeComplete={this.handleChangeComplete}
                            />
                        </div>

                        <div className="flex2">
                            <canvas ref={this.canvas} id="canvas" className="canvasbox"></canvas>
                        </div>
                        <div className="flexfull">
                            <video ref={this.video} className="videobox" autoPlay="autoplay" id="myvideo"></video>
                        </div>
                    </div>

                </div>


                <div className="videoboxes "></div>
                <img ref={this.imgHolder} id="imgholder" className="imgholder hidden" src="" alt=""></img>


            </div >

        );
    }
}

class Loading extends Component {
    render() {
        return (
            <div className="mb10">
                <div data-loading className="iblock bx--loading bx--loading--small">
                    <svg className="bx--loading__svg" viewBox="-75 -75 150 150">
                        <title>Loading</title>
                        <circle cx="0" cy="0" r="37.5" />
                    </svg>
                </div>
                <div className="iblock loadingtitle"> Loading Handtrack.js model ..</div>


            </div>
        )
    }
}


export default Doodle;