import moment from "moment";
import React from "react";

import "./style.scss";

function About() {
    function getMyYearsOld() {
        return moment("1992-12-23").fromNow(true);
    }

    return (
        <div className="about">
            Hello, I'm Giovani Cassiano! <br />
            <br />
            I’m {getMyYearsOld()}, Computer Engineer from Minas Gerais, Brazil, with a degree from the National Institute of Telecommunications (INATEL). I have a strong passion for software development, automation, and system optimization.
            <br />
            <br />
            <br />
            With experience in Linux environments, I enjoy developing and customizing applications, particularly focusing on browser modifications and creating bots for MMORPGs like Tibia and PXG. My technical interests include Python programming, system performance tuning, and network security.
            <br />
            <br />
            Beyond technology, I appreciate nature, trekking, cooking, biking, and riding motorcycles. I’m always eager to learn, explore new challenges, and build innovative solutions.

            <br />
            <br />
            
            <b>Contact:</b> <br />
            gjcassiano@gmail.com
            <br /> 
            <br />
            <a
                href="https://wa.me/5535997709999"
                target="_blank"
                rel="noreferrer"
            >
                +55 035 997909999{" "}
            </a>
        </div>
    );
}

export default About;
