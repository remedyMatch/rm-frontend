import {Collapse} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {Alert, Color} from "@material-ui/lab";
import clsx from "clsx";
import React from "react";

interface Props {
    error?: string;
    onClose?: () => void;
    severity?: Color;
    className?: string;
    innerClassName?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    alert: {
        borderRadius: "8px",
        "&>div:first-child": {
            alignSelf: "center"
        }
    },
    message: {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        fontSize: "16px"
    }
}));

const ErrorToast: React.FC<Props> = props => {
    const classes = useStyles();
    return (
        <Collapse in={!!props.error} className={props.className}>
            <Alert variant="filled"
                   onClose={props.onClose}
                   severity={props.severity || "error"}
                   className={clsx(classes.alert, props.innerClassName)}>
                <span className={classes.message}>
                    {props.error}
                </span>
            </Alert>
        </Collapse>
    );
};

export default ErrorToast;