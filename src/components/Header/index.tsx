import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import "./style.scss";

function Header() {
    let [active, setActive] = useState(0);
    let navigate = useNavigate();

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

    return (
        <div className="header">
            <strong>GIOVANI CASSIANO</strong>
            <span>SOFTWARE ENGINNER</span>
            <div className="links">
                {createLink(0, "/about", "About Me")}
                {createLink(1, "/profile", "Profile")}
                {createLink(2, "/skills", "Skills")}
            </div>
        </div>
    );
}

export default Header;
