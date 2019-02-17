import React, { Component } from "react";
import {
    NavLink
} from "react-router-dom";
class Sidebar extends Component {
    render() {
        return (
            <div className="sidebarcontent">
                <div className="sidebartitle">
                    <span className="bx--type-epsilon"> handtrack.js </span>
                    <span className="lighttext"> </span>
                </div>
                <div className="lighttext">v0.0.6</div>

                <br />
                <br />

                {/* <div className="sidebarlinks">
                    <NavLink exact to="/">Home</NavLink>
                </div> */}
                <div className="sidebarlinks">
                    <NavLink exact to="/">demo</NavLink>
                </div>
                <div className="sidebarlinks">
                    <NavLink to="/game">game</NavLink>
                </div>
                <div className="sidebarlinks">
                    <NavLink to="/about">about</NavLink>
                </div>


            </div>
        );
    }
}

export default Sidebar;