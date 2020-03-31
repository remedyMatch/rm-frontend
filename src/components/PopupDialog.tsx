import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import ErrorToast from "./ErrorToast";
import {makeStyles} from "@material-ui/core/styles";

declare type Width = "small" | "medium" | "large" | string | undefined;

interface Props {
    open: boolean;
    title: string;
    width?: Width;
    error?: string;
    disabled?: boolean;
    className?: string;
    onFirst?: () => void;
    onSecond?: () => void;
    firstTitle?: string;
    secondTitle?: string;
    onCloseError?: () => void;
}

const getCSSWidth = (width: Width) => {
    switch (width) {
        case "small":
            return "40vh";
        case "medium":
            return "60vh";
        case "large":
            return "80vh";
        case undefined:
            return "40vh";
        default:
            return width;
    }
};

const getMaxWidth = (width: Width) => {
    switch (width) {
        case "small":
            return "sm";
        case "medium":
            return "md";
        case "large":
            return "lg";
        case undefined:
            return "sm";
        default:
            return "sm";
    }
};

const useStyles = makeStyles({
    content: (props: Props) => ({
        width: getCSSWidth(props.width),
        paddingBottom: "16px"
    }),
    children: {
        marginTop: "16px",
        display: "flex",
        flexDirection: "column"
    }
});

const PopupDialog: React.FC<Props> = props => {
    const classes = useStyles(props);
    return (
        <Dialog
            open={props.open}
            maxWidth={getMaxWidth(props.width)}
            disableBackdropClick>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <div className={classes.content}>
                    <ErrorToast error={props.error} onClose={props.onCloseError}/>
                    <div className={classes.children}>
                        {props.children}
                    </div>
                </div>
            </DialogContent>
            <DialogActions>
                {props.onFirst && (
                    <Button
                        onClick={props.onFirst}
                        color="secondary"
                        disabled={props.disabled}>
                        {props.firstTitle || "Abbrechen"}
                    </Button>
                )}
                {props.onSecond && (
                    <Button
                        onClick={props.onSecond}
                        color="secondary"
                        disabled={props.disabled}>
                        {props.secondTitle || "Fertig"}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default PopupDialog;