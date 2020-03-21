import React from "react";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {Alert, Color} from "@material-ui/lab";
import clsx from "clsx";

interface Props {
    error?: string;
    onClose?: () => void;
    severity?: Color;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) =>
    ({
        root: {
            overflow: "hidden",
            height: "0px",
            transition: theme.transitions.create(["height", "margin"])
        },
        open: {
            height: "48px",
            marginBottom: "16px"
        }
    }));

const ErrorToast: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <div className={clsx(classes.root, props.error && classes.open, props.className)}>
            <Alert variant="filled"
                   onClose={props.onClose}
                   severity={props.severity || "error"}>
                {props.error}
            </Alert>
        </div>
    );
};

export default ErrorToast;