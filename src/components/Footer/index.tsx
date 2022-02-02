import React from "react";
import "./style.scss";
import FaceSvg from "../../static/img/facebook.svg";
import InstaSvg from "../../static/img/instagram.svg";
import LinkedinSvg from "../../static/img/linkedin.svg";
import StackSvg from "../../static/img/stackoverflow.svg";
import GithubSvg from "../../static/img/github.svg";

function Footer() {
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
        <>
            <div className="info-actions">
                {getSocialButton("https://github.com/gjcassiano", GithubSvg)}
                {getSocialButton(
                    "https://stackoverflow.com/users/10247892/giovani-cassiano",
                    StackSvg
                )}
                {getSocialButton(
                    "https://www.linkedin.com/in/gjcassiano/",
                    LinkedinSvg
                )}
                {/* {getSocialButton("https://www.instagram.com/gjcassiano/", InstaSvg)}
        {getSocialButton(
          "https://www.facebook.com/giovani.cassiano.3/",
          FaceSvg
        )} */}

                <small>minimalist</small>
            </div>
        </>
    );
}

export default Footer;
