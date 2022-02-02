import moment from "moment";
import React from "react";

import "./style.scss";

function About() {
    function getMyYearsOld() {
        return moment("1992-12-23").fromNow();
    }

    return (
        <div className="about">
            Hello there, I am Giovani Cassiano and I come from Minas Gerais,
            Brazil and I was born {getMyYearsOld()}.
            <p />
            Graduated in Computer Engineering at INATEL - National Institute of
            Telecommunications (Instituto Nacional de Telecomunicações -
            Inatel).
            <p />
            As a simple guy, I like nature, trekking, cooking, biking, rider
            motorcycle and make some bots for mmorpg games (tibia, pxg).
            <p />
            <b>Contact:</b> <br />
            gjcassiano@gmail.com
            <br /> +55 035 997909999
            <br />
            <a
                href="https://wa.me/5535997709999"
                target="_blank"
                rel="noreferrer"
            >
                {" "}
                WhatsApp{" "}
            </a>
        </div>
    );
}

export default About;
