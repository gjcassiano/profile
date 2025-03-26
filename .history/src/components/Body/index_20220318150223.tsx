import React from "react";
import "./style.scss";

function Body(props: any) {
    return (
        <div className="body">
            {props.children}
        </div>
    );
}

export default Body;
