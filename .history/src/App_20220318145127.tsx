import React from "react";
import "./App.css";
import ReactGA from "react-ga";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Body from "./components/Body";

function App(props: any) {
    ReactGA.pageview(window.location.pathname + window.location.search);

    return (
        <div className="App">
            <title>Giovanic</title>
            <Header />
            <Body> {props.children}</Body>
            <Footer />
        </div>
    );
}

export default App;
