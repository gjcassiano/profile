import React, { useState } from "react";

import "./style.scss";

import RoseI from "../../static/img/rose_and_i.png";

function Rose() {
    let [show, setShow] = useState(false);

    function showImg() {
        setShow(!show);
    }
    return (

        <div className="rose">
            <link href='https://fonts.googleapis.com/css?family=Solitreo' rel='stylesheet'/>

            {!show &&  <div className="container">
                <div className="envelope"></div>
                <div className="cardd" onClick={showImg}>
                    <h1 className="message">Gosto munto de você!<br/>e com você eu vou em qualquer lugar :3</h1>
                    <div className="heart">

                    </div>
                </div>
                <div className="cover"></div>
                <div className="lid"></div>
                <div className="shadow"></div>
               
            </div>
        }
            {show &&
                <div className="us">
                    <img src={RoseI} />
                </div>
            }
        </div>
    );
}

export default Rose;
