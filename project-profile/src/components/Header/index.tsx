import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import "./style.scss";
import FaceSvg from "../../static/img/facebook.svg";
import InstaSvg from "../../static/img/instagram.svg";
import LinkedinSvg from "../../static/img/linkedin.svg";
import StackSvg from "../../static/img/stackoverflow.svg";
import GithubSvg from "../../static/img/github.svg";
import Whats from "../../static/img/whats.svg";

function Header() {
    let [active, setActive] = useState(0);
    let navigate = useNavigate();

    useEffect(() => {
        if (window.location.pathname === "/skills") {
            setActive(1);
        } else if (window.location.pathname === "/about") {
            setActive(2);
        } else {
            setActive(0);
        }
    }, []);

    function createLink(num: number, path: string, text: string) {
        return (
            <span
                className={active === num ? "active" : ""}
                onClick={() => {
                    setActive(num);
                    navigate(path, { replace: false });

                    window.scroll(0, 0);
                }}
            >
                {text}
            </span>
        );
    }
    function getSocialButton(href: any, src: any) {
        return (
            <>
                <a
                    className="link-social"
                    target="_blank"
                    href={href}
                    role="button"
                    rel="noreferrer"
                >
                    <img src={src} />
                </a>
            </>
        );
    }
  
    return (
        <div className="header">
            <div className="container">
                <div className="actions">
                    <strong>GIOVANI CASSIANO</strong>
                    <div className="info-actions">
                {getSocialButton(
                    "https://www.linkedin.com/in/gjcassiano/",
                    LinkedinSvg
                )}
                 {getSocialButton(
                    "https://wa.me/5535997709999",
                    Whats
                )}
                {getSocialButton("https://github.com/gjcassiano", GithubSvg)}
                {getSocialButton(
                    "https://stackoverflow.com/users/10247892/giovani-cassiano",
                    StackSvg
                )}
                
                <small>minimalist</small>
            </div>
                </div>
                <span>SOFTWARE ENGINNER</span>
                <div className="links">
                    {createLink(0, "/profile", "Profile")}
                    {createLink(1, "/skills", "Skills")}
                    {createLink(2, "/about", "About Me")}
                </div>
            </div>

        <div className="divider-header"></div>    
        </div>
        
    );
}

export default Header;
