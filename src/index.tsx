import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import ReactGA from "react-ga";
import { BrowserRouter, useRoutes } from "react-router-dom";
import Profile from "./components/Profile";
import About from "./components/About";
import App from "./App";
import Skills from "./components/Skills";
ReactGA.initialize("G-YEMC9Q838Q");

const RouterApp = () => {
    let routes = useRoutes([
        {
            path: "/",
            element: (
                <App>
                    <About />
                </App>
            ),
        },
        {
            path: "profile",
            element: (
                <App>
                    <Profile />
                </App>
            ),
        },
        {
            path: "about",
            element: (
                <App>
                    <About />
                </App>
            ),
        },
        {
            path: "skills",
            element: (
                <App>
                    <Skills />
                </App>
            ),
        },
    ]);
    return routes;
};

ReactDOM.render(
    <React.StrictMode>
        <BrowserRouter>
            <RouterApp />
        </BrowserRouter>
    </React.StrictMode>,
    document.getElementById("root")
);

reportWebVitals();
