import React, { Component } from "react";
import { Button } from 'carbon-components-react';
import * as handTrack from "handtrackjs"

class Demo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modelParams: {
                scoreThreshold: 0.7,
                flipHorizontal: false
            },
            model: null,
            modelLoaded: false,
            videoPlayStatus: false,
            showHighlight: false,
            highlightText: "Attention needed"
        }

        this.canvas = React.createRef();
        this.videoButton = React.createRef();
        this.imgHolder = React.createRef();
        this.video = React.createRef();

    }
    componentWillUnmount() {
        console.log("Page unmounting disposing model")
        this.state.model.dispose()
    }
    componentDidMount() {
        this.video.current.width = 450
        this.video.current.height = 380;

        this.canvasContext = this.canvas.current.getContext('2d')
        this.drawCenter = true
        // console.log(this.canvas.current)
        handTrack.load(this.state.modelParams).then(loadedModel => {
            this.setState({ model: loadedModel })
            this.setState({ modelLoaded: true })
            // console.log("model loaded", this.state)
            document.getElementsByClassName("handimagebox")[0].click()
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
                this.state.model.renderPredictions(predictions, this.canvas.current, this.canvasContext, inputsource)
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
        let array = Array.from(Array(16).keys());

        let imageList = array.map(image => {
            return <img key={image} onClick={this.clickImage.bind(this)} src={require(`../images/${image}.jpg`)} alt="" className="handimagebox" />
        });

        return (
            <div className="">

                <div className="pagetitle">Demo</div>
                <br />
                {this.state.modelLoaded ? null : <Loading />}

                <div className="clickable">
                    <div className={this.state.modelLoaded ? "hidden" : "disableoverlay"}></div>
                    <div className={this.state.showHighlight ? "orangehighlight mb10" : "hidden"}> {this.state.highlightText}</div>
                    <div className="bluehightlight mb10">
                        All detection is done in the browser! <span className="lighttext"> Click on an image or  Start video</span>
                    </div>
                    <div>
                        <Button id="videobutton" onClick={this.videoButtonClick.bind(this)} >  {this.state.videoPlayStatus ? "▩ Stop Video Detection" : " ▶ ️ Start Video Detection"} </Button>

                        <div className="bx--form-item bx--checkbox-wrapper  flipimagecheckbox">
                            <input onClick={this.flipImageCheck.bind(this)} id="flipimagecheckbox" className="bx--checkbox" type="checkbox" value="new" name="checkbox"></input>
                            <label htmlFor="flipimagecheckbox" className="bx--checkbox-label"> Flip Image </label>
                        </div>
                    </div>
                    <div className="flex mt10">
                        <div className="flexfull">
                            <div id="instruction" className="lighttext pb10 ">
                                Modify confidence score threshold.
                            </div>
                            <div className="mt10 flex  mr20 ">
                                <div className="slidecontainer flexfull  ">
                                    <input type="range" val={this.state.modelParams.scoreThreshold * 100} onChange={this.updateConfidence.bind(this)} min="1" max="100" className="slider" id="confidencerange"></input>
                                </div>
                                <div className="iblock confidencethreshold ">  {this.state.modelParams.scoreThreshold} </div>
                            </div>
                            <div className="scrollholdbox ">
                                {imageList}
                            </div>
                        </div>
                        <div className="flex5 ">
                            <canvas ref={this.canvas} id="canvas" className="canvasbox"></canvas>
                        </div>
                    </div>

                </div>


                <div className="videoboxes "></div>
                <img ref={this.imgHolder} id="imgholder" className="imgholder hidden" src="" alt=""></img>
                <video ref={this.video} className="videobox hidden" autoPlay="autoplay" id="myvideo"></video>

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


export default Demo;