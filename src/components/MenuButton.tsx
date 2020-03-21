import React from "react";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {Button, IconButton} from "@material-ui/core";
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
        margin: "4px 8px",
        "&:hover": {
            backgroundColor: "white"
        }
    },
    iconButton: {
        borderRadius: "4px",
        backgroundColor: theme.palette.primary.main,
        padding: "6px 16px",
        color: "black"
    },
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