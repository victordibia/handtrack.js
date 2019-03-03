import React, { Component } from "react";
import { Button } from 'carbon-components-react';
import { ChromePicker } from 'react-color'
import * as handTrack from "handtrackjs"

let xpos = 0
let ypos = 0 ;
class Parallax extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modelParams: {
                scoreThreshold: 0.9,
                flipHorizontal: true,
                maxNumBoxes: 1
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

        this.media ={width:450, height:380}

        

    }
    componentWillUnmount() {
        console.log("Page unmounting disposing model")
        this.state.model.dispose()
    }

    handleChangeComplete = (color) => {
        this.setState({ doodlecolor: color.hex });
    };

    componentDidMount() {
        this.video.current.width = 450
        this.video.current.height = 380;
        xpos = 450/2
        ypos = 380/2

        this.cav = document.getElementById("canvas")
        this.cav.width = 450
        this.cav.height = 380
        this.canvasContext = this.cav.getContext('2d')
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
                this.runDrawPredictions(predictions)
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

    runDrawPredictions(predictions) {
        // context.clearRect(0, 0, canvas.width, canvas.height);
       

        this.canvasContext.save();
        if (this.state.modelParams.flipHorizontal) {
            this.canvasContext.scale(-1, 1);
            this.canvasContext.translate(-this.media.width, 0);
        }
        // this.canvasContext.drawImage(mediasource, 0, 0, mediasource.width, mediasource.height);
        this.canvasContext.restore();
        // this.canvasContext.font = '10px Arial';

        // console.log('number of detections: ', predictions.length);
        for (let i = 0; i < predictions.length; i++) { 

            this.canvasContext.beginPath(); // begin

            this.canvasContext.lineWidth = 5;
            this.canvasContext.lineCap = 'round';
            this.canvasContext.strokeStyle = this.state.doodlecolor; 
            this.canvasContext.moveTo(xpos, ypos); // from
            xpos = predictions[i].bbox[0] + (predictions[i].bbox[2] / 2);
            ypos = predictions[i].bbox[1] + (predictions[i].bbox[3] / 2)
            this.canvasContext.lineTo(xpos, ypos); // to

            this.canvasContext.stroke(); // draw it!
            this.canvasContext.closePath(); 
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
            this.canvasContext.clearRect(0, 0, this.cav.width, this.cav.height);
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

    clearButtonClick(e){
        this.canvasContext.clearRect(0, 0, this.cav.width, this.cav.height);

        // Save as doodle
        //         var image = new Image();
        // image.id = "pic"
        // image.src = canvas.toDataURL();
        // document.getElementById('image_for_crop').appendChild(image);

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
                            <Button className="mt10 width100" id="clearbutton" onClick={this.clearButtonClick.bind(this)} >  Clear Canvas </Button>

                        </div>

                        <div className="flex2 relative">
                            <video ref={this.video} className="videobox videoflip" autoPlay="autoplay" id="myvideo"></video>
                            <canvas ref={this.canvas} id="canvas" className="canvasbox absolute top left "></canvas>
                        </div>
                        <div className="flexfull">
                            
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


export default Parallax;