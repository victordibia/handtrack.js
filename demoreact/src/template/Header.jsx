import React, { Component } from "react";

class Header extends Component {
    render() {
        return (
            <div className="headerbox pad20 ">
                <div className="bx--type-mega">
                    Handtrack.js
            </div>
                <span className="lighttext"> A library for prototyping realtime handtracking in the browser.
                    [<a href="https://github.com/victordibia/handtrack.js/">Github</a>]</span>
                <br />

            </div>
        );
    }
}

export default Header;