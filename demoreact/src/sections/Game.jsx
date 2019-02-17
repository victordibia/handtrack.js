import React, { Component } from "react";
// import ReactMarkdown from "react-markdown"

class Game extends Component {
    render() {
        //  
        return (
            <div className="">
                <div className="pagetitle">Sample Game</div>
                <br />
                <div>
                    <div className="bluehightlight mb10">
                        Handtrack.js lets you track hand position in an image or video element, right in the browser.
                    </div>
                    Underneath, it uses trained Convoluntional Neural Network model (SSD, MobilenetV2 Architecture)
                </div>

                {/* <ReactMarkdown source={input}></ReactMarkdown> */}

                <div class="pulse "></div>
            </div>

        );
    }
}

export default Game;