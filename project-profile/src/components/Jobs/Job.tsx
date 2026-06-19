import React from "react";
import "./Job.scss";

export default function Job(props: any) {
    return (
        <div className="job">
            <div className="date">{props.date}</div>
            <div className="description">{props.children}</div>
        </div>
    );
}
