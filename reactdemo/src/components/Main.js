import "./main.css";
// import "antd/dist/antd.css";
import { Route, HashRouter } from "react-router-dom";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import Landing from "./Landing/Landing";

function Main() {
  return (
    <HashRouter>
      <div className="flex flex-col   h-screen container-fluid">
        <Header />
        <main className="  w-full flex-grow ">
          <Route exact path="/" render={(props) => <Landing {...props} />} />
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default Main;
