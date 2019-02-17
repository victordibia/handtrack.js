import React, { Component } from "react";
import {
    Route,
    HashRouter
} from "react-router-dom";

import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";

import Demo from "../sections/Demo"
import About from "../sections/About"
import Game from "../sections/Game"

class Main extends Component {
    render() {
        return (
            <HashRouter>
                <div className="containerwrap">
                    <div className="aside sidebar">
                        <div id="sidebar"> <Sidebar /> </div>
                    </div>
                    <div className="aside maincontent">
                        <div id="header">
                            <Header />
                        </div>

                        <div className="pagecontent bottomcontent pad20">
                            <Route exact path="/" component={Demo} />
                            <Route path="/about" component={About} />
                            <Route path="/demo" component={Demo} />
                            <Route path="/game" component={Game} />
                        </div>

                        <div id="footer"> <Footer /> </div>
                    </div>
                </div>
            </HashRouter>

        );
    }
}

export default Main;