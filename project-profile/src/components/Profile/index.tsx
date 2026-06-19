import React from "react";
import Job from "../Jobs/Job";
import Y2017 from "../Jobs/Y2017";
import Y2018 from "../Jobs/Y2017";
import Y2019 from "../Jobs/Y2019";
import Y2020 from "../Jobs/Y2020";
import Place from "../Place";

import "./style.scss";
import Y2022 from "../Jobs/Y2022";

function Profile(props: any) {
    return (
        <>  
            <Place
                name="Bees Brasil (AB InBev)"
                date="Abril 2nd 2022 ongoing"
            >
                <Job date="2022 to ongoing">
                    <Y2022></Y2022>
                </Job>

            </Place>
            <Place
                name="Instituto de Pesquisas Eldorado"
                date="January 2nd 2018 to 2022"
            >
                <Job date="2020 to 2022">
                    <Y2020></Y2020>
                </Job>

                <Job date="2019 to 2020">
                    <Y2019></Y2019>
                </Job>

                <Job date="2018 to 2019">
                    <Y2018></Y2018>
                </Job>
            </Place>
            <Place
                name="Motorola Mobility (a Lenovo Company)"
                date="2 January 2017 to 27 December 2017"
            >
                <Job>
                    <Y2017></Y2017>
                </Job>
            </Place>
        </>
    );
}

export default Profile;
