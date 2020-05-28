import {Typography} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import React from "react";
import Box from "@material-ui/core/Box";

interface Props {
}

const useStyles = makeStyles((theme: Theme) => ({
    footer: {
        paddingTop: "2em",
        marginTop: "auto",
        display: "flex",
        flexDirection: "column"
    },
    footerText: {
        color: "rgba(0, 0, 0, 0.32)",
        margin: "auto",
        transition: theme.transitions.create("color"),
        "&:hover": {
            color: "rgba(0, 0, 0, 0.87)"
        }
    },
    footerLink: {
        margin: "0.2rem 0.5rem",
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
            <Box display="flex" flexWrap="wrap" justifyContent="center" margin="0.5rem">
            <a className={classes.footerLink} href="/de">Startseite</a>
            <a className={classes.footerLink} href="/de/presse">Presse</a>
            <a className={classes.footerLink} href="/de/impressum">Impressum</a>
            <a className={classes.footerLink} href="/de/datenschutz">Datenschutz</a>
            </Box>
            <Typography className={classes.footerText}>
                &copy; RemedyMatch 2020
            </Typography>
        </div>
    );
};

export default Footer;
