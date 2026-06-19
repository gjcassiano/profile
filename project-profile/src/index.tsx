import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import ReactGA from "react-ga";
import { BrowserRouter, Navigate, useRoutes } from "react-router-dom";
import Profile from "./components/Profile";
import About from "./components/About";
import App from "./App";
import Skills from "./components/Skills";
import Rose from "./components/Rose";
ReactGA.initialize("G-YEMC9Q838Q");

const RouterApp = () => {
     
    let routes = useRoutes([
        {
            path: "/",
            element: <Navigate to="/profile" replace />,
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
        {
            path: "meu-bem",
            element: (
                    <Rose />
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
