import React, { Component } from "react";
// import ReactMarkdown from "react-markdown"

class About extends Component {
    render() {
        //  
        return (
            <div className="">
                <div className="pagetitle">About Handtrack.js</div>
                <br />
                <div>
                    <div className="bluehightlight mb10">
                        Handtrack.js lets you track hand position in an image or video element, right in the browser.
                    </div>
                    <div className="lh10">
                    Underneath, it uses trained Convoluntional Neural Network model (SSD, MobilenetV2 Architecture).
                    Details on how the model was trained can be found  <a rel="noopener noreferrer" href="https://medium.com/@victor.dibia/how-to-build-a-real-time-hand-detector-using-neural-networks-ssd-on-tensorflow-d6bac0e4b2ce" target="_blank">here</a> .
              
                    </div>
                </div>

                {/* <ReactMarkdown source={input}></ReactMarkdown> */}


            </div>

        );
    }
}

export default About;