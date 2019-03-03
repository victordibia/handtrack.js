import React, { Component } from "react";
import { Button } from 'carbon-components-react';
// import Script from 'react-load-script'
import xp from "./gametest"
import * as handTrack from "handtrackjs"


let gamex = 0

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

class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            canvasWidth: "200",
            modelParams: {
                scoreThreshold: 0.7,
                flipHorizontal: true,
                maxNumBoxes: 1
            },
            model: null,
            modelLoaded: false,
            videoPlayStatus: false,
            showHighlight: false,
            highlightText: "Attention needed"
        }

        this.canvasRef = React.createRef();
        this.contentHolder = React.createRef();
        this.video = React.createRef();
        this.videoCanvasRef = React.createRef();
        this.videoInterval = 200;
        this.usablecanvasWidth = 500
        // console.log(window.$)

    }
    runDetection(inputsource) {
        let self = this
        this.state.model.detect(inputsource).then(predictions => {
            if (predictions[0]) {
                let midval = predictions[0].bbox[0] + (predictions[0].bbox[2] / 2)
                gamex = this.usablecanvasWidth * (midval / inputsource.width)
                xp.setGamex(gamex)
                console.log('Predictions: ', this.usablecanvasWidth, midval / inputsource.width);

            }

            // if (this.canvas.current) {
            //     this.state.model.renderPredictions(predictions, this.canvas.current, this.canvas.current.getContext('2d'), inputsource)
            //     // console.log("FPS", model.getFPS())
            //     // $("#fps").text("FPS: " + model.getFPS())
            if (this.videoCanvasRef.current) {
                this.state.model.renderPredictions(predictions, this.videoCanvasRef.current, this.videoCanvasRef.current.getContext('2d'), inputsource)
            }
            if (this.state.videoPlayStatus && inputsource) {
                // window.requestAnimationFrame(function () {
                setTimeout(() => {
                    self.runDetection(inputsource)
                }, this.videoInterval);
            }

        });
    }
    componentDidMount() {
        //    console.log("Doc height", document.documentElement.clientHeight, window.innerWidth, this.canvasRef.current.getBoundingClientRect().top)

        let usablecanvasWidth = document.body.clientWidth - 250
        this.canvasRef.current.style.width = usablecanvasWidth + "px";
        this.canvasRef.current.style.maxWidth = usablecanvasWidth + "px";
        // this.canvasRef.current.width = usablecanvasWidth;
        this.usablecanvasWidth = usablecanvasWidth

        let usableCanvasHeight = document.documentElement.clientHeight - this.canvasRef.current.getBoundingClientRect().top - 40
        this.canvasRef.current.style.height = usableCanvasHeight + "px"
        // this.canvasRef.current.height = usableCanvasHeight;

        console.log("Usable h,w", usableCanvasHeight, usablecanvasWidth)

        handTrack.load(this.state.modelParams).then(loadedModel => {
            this.setState({ model: loadedModel })
            this.setState({ modelLoaded: true })
            // console.log("model loaded", this.state)
            // document.getElementsByClassName("handimagebox")[0].click()

        });
        xp.startPlanck()

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


    componentWillUnmount() {
        console.log("Page unmounting disposing model")
        this.state.model.dispose()
    }

    videoButtonClick(e) {
        let self = this
        if (this.state.videoPlayStatus) {
            this.setState({ videoPlayStatus: false })
            handTrack.stopVideo()
        } else {
            handTrack.startVideo(this.video.current).then(function (status) {
                console.log("Camera status", status)
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

    handleScriptCreate() {
        this.setState({ scriptLoaded: false })
    }

    handleScriptError() {
        this.setState({ scriptError: true })
    }

    handleScriptLoad() {
        this.setState({ scriptLoaded: true })


        // setTimeout(() => {
        //     xp.stopPlanck()
        //     console.log("stopped planck")
        // }, 2000);
    }

    resizeCanvas(e) {
        console.log(e.target.width)
    }
    render() {
        return (
            <div className="">

                <div ref={this.contentHolder} className="pagetitle">Game Demo</div>
                <br />
                {this.state.modelLoaded ? null : <Loading />}
                <div className={this.state.showHighlight ? "orangehighlight mb10" : "hidden"}> {this.state.highlightText}</div>

                <div className="clickable">
                    <div className={this.state.modelLoaded ? "hidden" : "disableoverlay"}></div>

                    <div className="bluehightlight mb10 lh10">
                        Control the pong game paddle by waving your hands in front of the camera. Click start video to begin.
                    </div>
                    <Button className="mb10" id="videobutton" onClick={this.videoButtonClick.bind(this)} >  {this.state.videoPlayStatus ? "▩ Stop Video Control" : " ▶ ️ Start Video Control"} </Button>
                    <div className="flexfull ">
                        <div id="instruction" className="lighttext mt10">Modify confidence score threshold.</div>
                        <div className="mt10 flex">
                            <div className="slidecontainer flexfull ">
                                <input type="range" val={this.state.modelParams.scoreThreshold * 100} onChange={this.updateConfidence.bind(this)} min="1" max="100" className="slider" id="confidencerange"></input>
                            </div>
                            <div className="iblock confidencethreshold ">  {this.state.modelParams.scoreThreshold} </div>
                        </div>
                    </div>
                    <canvas ref={this.canvasRef} className="gamecanvas" id="stage" ></canvas>
                    <canvas className="videocanvasoutput" ref={this.videoCanvasRef} id="videocanvas"></canvas>
                </div>

                {/* <Script
                    url="https://cdn.jsdelivr.net/npm/planck-js@0.3.3/dist/planck-with-testbed.js"
                    onCreate={this.handleScriptCreate.bind(this)}
                    onError={this.handleScriptError.bind(this)}
                    onLoad={this.handleScriptLoad.bind(this)}
                /> */}
                <video ref={this.video} className="videobox hidden" autoPlay="autoplay" id="myvideo"></video>


            </div>


        );
    }
}

export default Game;