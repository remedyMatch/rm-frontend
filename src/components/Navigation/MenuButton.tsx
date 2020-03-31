import React from "react";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {Button} from "@material-ui/core";
import clsx from "clsx";

interface Props {
    label: string;
    icon: React.ElementType;
    onClick: () => void;
    className?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    label: {
        textTransform: "none"
    },
    button: {
        transition: theme.transitions.create("background-color"),
        backgroundColor: "white",
        color: "black",
        margin: "4px 8px",
        "&:hover": {
            backgroundColor: "rgba(255,255,255,0.8)"
        }
    }
}));

const MenuButton: React.FC<Props> = props => {
    const classes = useStyles();
    return <Button disableElevation
                   className={clsx(props.className, classes.button)}
                   classes={{label: classes.label}}
                   variant="contained"
                   onClick={props.onClick}
                   color="primary"
                   startIcon={React.createElement(props.icon)}>
        {props.label}
    </Button>
};

export default (MenuButton);