import {Button, Fade, Typography} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";

interface Props {
    active: boolean;
    className?: string;
    icon?: string;
    iconAlt?: string;
    title: string;
    subtitle?: string;
    action?: string;
    onActionClicked?: () => void;
    contentClass?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    title: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "24px",
        fontWeight: 600,
        lineHeight: 1.33,
        color: "#333"
    },
    subtitle: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        color: "rgba(0, 0, 0, 0.54)",
        flexGrow: 1
    },
    titleContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginTop: "-2.5em"
    },
    titleImageContainer: {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
        borderRadius: "50%",
        padding: "1em",
        marginRight: "2em"
    },
    titleTextContainer: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1
    },
    subtitleActionContainer: {
        paddingTop: "12px",
        display: "flex",
        flexDirection: "row"
    },
    titleImage: {
        height: "5em",
        color: "#333"
    },
    titleButton: {
        margin: "auto 0px 8px 32px",
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        fontSize: "16px",
        height: "48px",
        textTransform: "none",
        color: "#007c92",
        border: "2px solid #007c92",
        borderRadius: "8px",
        whiteSpace: "nowrap",
        padding: "8px 24px",
        placeSelf: "flex-end",
        flexShrink: 0
    },
    content: {
        margin: "2em 0em"
    }
}));

const FlowPage: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <>
            <Fade in={props.active} timeout={1000}>
                <div className={props.className}>

                    <div className={classes.titleContainer}>
                        {props.icon && (
                            <div className={classes.titleImageContainer}>
                                <img
                                    className={classes.titleImage}
                                    alt={props.iconAlt}
                                    src={props.icon}/>
                            </div>
                        )}
                        <div className={classes.titleTextContainer}>
                            <Typography className={classes.title}>{props.title}</Typography>
                            <div className={classes.subtitleActionContainer}>
                                <Typography className={classes.subtitle}>{props.subtitle}</Typography>
                                {props.action && (
                                    <Button
                                        onClick={props.onActionClicked}
                                        variant="text"
                                        className={classes.titleButton}>
                                        {props.action}
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={classes.content}>
                        <div className={props.contentClass}>
                            {props.children}
                        </div>
                    </div>

                </div>
            </Fade>
        </>
    )
};

export default FlowPage;