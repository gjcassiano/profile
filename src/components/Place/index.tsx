import React from "react";

import "./style.scss";

function Place(props: any) {
    return (
        <div className="place">
            <div className="title">
                <div className="name">
                    <strong>{props.name}</strong>
                </div>
                <div className="date">
                    <strong>{props.date}</strong>
                </div>
            </div>

            {props.children}
            <div className="divider">
                <i>//</i>
            </div>
        </div>
    );
}

export default Place;
