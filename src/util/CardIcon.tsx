import React from "react";
import opMask from "../Icons/opMask.svg"
import disinfectant from "../Icons/disinfectant.svg"
import gloves from "../Icons/gloves.svg"
import protectiveClothing from "../Icons/protectiveClothing.svg"
import protectiveGoggles from "../Icons/protectiveGoggles.svg"

export type IconKey = "opMask" | "ffpMask" | "protectionGoggles" | "disinfectant" | "protectiveClothing" | "gloves"

export const CardIcon: React.FC<{ iconKey: IconKey | undefined }> = ({iconKey}) => {
    switch (iconKey) {
        case "disinfectant":
            return <img src={disinfectant} alt={"Icon"}/>
        case "ffpMask":
            return <img src={opMask} alt={"Icon"}/>
        case "gloves":
            return <img src={gloves} alt={"Icon"}/>
        case "opMask":
            return <img src={opMask} alt={"Icon"}/>
        case "protectionGoggles":
            return <img src={protectiveGoggles} alt={"Icon"}/>
        case "protectiveClothing":
            return <img src={protectiveClothing} alt={"Icon"}/>
        case undefined:
            return <></>
    }
};
