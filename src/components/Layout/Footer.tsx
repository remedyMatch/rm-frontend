import {Typography} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";

interface Props {
}

const useStyles = makeStyles((theme: Theme) => ({
    footer: {
        paddingTop: "2em",
        marginTop: "auto",
        display: "flex"
    },
    footerText: {
        color: "rgba(0, 0, 0, 0.32)",
        marginRight: "auto",
        transition: theme.transitions.create("color"),
        "&:hover": {
            color: "rgba(0, 0, 0, 0.87)"
        }
    },
    footerLink: {
        marginLeft: "1em",
        textDecoration: "none",
        color: "rgba(0, 0, 0, 0.32)",
        transition: theme.transitions.create("color"),
        "&:hover": {
            color: "rgba(0, 0, 0, 0.87)"
        }
    }
}));

const Footer: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <div className={classes.footer}>
            <Typography className={classes.footerText}>
                &copy; RemedyMatch 2020
            </Typography>
            <a className={classes.footerLink} href="/de">Startseite</a>
            <a className={classes.footerLink} href="/de/presse">Presse</a>
            <a className={classes.footerLink} href="/de/impressum">Impressum</a>
            <a className={classes.footerLink} href="/de/datenschutz">Datenschutz</a>
        </div>
    );
}

export default Footer;
