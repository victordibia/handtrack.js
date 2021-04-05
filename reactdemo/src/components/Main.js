import "./main.css";
// import "antd/dist/antd.css";
import { Route, HashRouter } from "react-router-dom";
import Footer from "./footer/Footer";
import Header from "./header/Header";
import Landing from "./Landing/Landing";
import SimpleDemo from "./SimpleDemo/SimpleDemo";

function Main() {
  return (
    <HashRouter>
      <div className="flex   flex-col   h-screen ">
        <Header />
        <main className="  w-full flex-grow ">
          <Route exact path="/" render={(props) => <Landing {...props} />} />
          <Route
            exact
            path="/simple"
            render={(props) => <SimpleDemo {...props} />}
          />
        </main>
        <Footer />
      </div>
    </HashRouter>
  );
}

export default Main;
