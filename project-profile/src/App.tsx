import React from "react";
import "./App.css";
import ReactGA from "react-ga";
import Header from "./components/Header";
import Body from "./components/Body";

function App(props: any) {
    ReactGA.pageview(window.location.pathname + window.location.search);

    return (
        <div className="App">
            <title>Giovanic</title>
            <Header />
            <Body> {props.children}</Body>
        </div>
    );
}

export default App;
