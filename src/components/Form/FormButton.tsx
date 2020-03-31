import {makeStyles} from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import React from "react";

interface Props {
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
    type?: "button" | "submit" | "reset";
    size?: "small" | "medium" | "large";
    variant?: "text" | "outlined" | "contained";
}

export const FormButton: React.FC<Props> = props => {
    const inputStyles = makeStyles((theme) => {
        return {
            root: {
                textTransform: "none",
                borderRadius: theme.spacing(0.5),
                fontSize: "16px"
            },
            focused: {}
        };
    });
    const inputClasses = inputStyles();

    return (
        <Button className={[inputClasses.root, props.className || ""].join(" ")}
                disabled={props.disabled || false}
                variant={props.variant || "contained"}
                color="secondary"
                disableElevation
                onClick={props.onClick}
                type={props.type}
                size={props.size || "medium"}
        >
            {props.children}
        </Button>
    );
};

