import React from "react";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@material-ui/core";
import {Bedarf} from "../../Model/Bedarf";

interface Props {
    open: boolean;
    item: Bedarf;
    onContact?: () => void;
    onDone: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    content: {
        width: "40vw",
        paddingBottom: "16px",
        display: "flex",
        flexDirection: "column"
    },
    row: {
        display: "flex"
    },
    left: {
        width: "35%",
        textAlign: "right",
        padding: "4px 16px"
    },
    right: {
        width: "65%",
        fontWeight: 500,
        padding: "4px 16px"
    }
}));

const InfoDialog: React.FC<Props> = props => {
    const classes = useStyles();

    return (
        <Dialog
            maxWidth="lg"
            open={props.open}
            onClose={props.onDone}>
            <DialogTitle>Details</DialogTitle>
            <DialogContent>
                {props.item && (
                    <div className={classes.content}>
                        <div className={classes.row}>
                            <span className={classes.left}>Kategorie</span>
                            <span className={classes.right}>{props.item.artikel.artikelKategorie.name}</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.left}>Artikel</span>
                            <span className={classes.right}>{props.item.artikel.name}</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.left}>Beschreibung</span>
                            <span className={classes.right}>{props.item.artikel.beschreibung}</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.left}>EAN</span>
                            <span className={classes.right}>{props.item.artikel.ean}</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.left}>Hersteller</span>
                            <span className={classes.right}>{props.item.artikel.hersteller}</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.left}>Anzahl</span>
                            <span className={classes.right}>{props.item.anzahl}</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.left}>Standort</span>
                            <span className={classes.right}>{props.item.standort}</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.left}>Medizinisch</span>
                            <span className={classes.right}>{props.item.medizinisch ? "Ja" : "Nein"}</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.left}>Steril</span>
                            <span className={classes.right}>{props.item.steril ? "Ja" : "Nein"}</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.left}>Originalverpackt</span>
                            <span className={classes.right}>{props.item.originalverpackt ? "Ja" : "Nein"}</span>
                        </div>
                        <div className={classes.row}>
                            <span className={classes.left}>Kommentar</span>
                            <span className={classes.right}>{props.item.kommentar}</span>
                        </div>
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                {props.onContact && (
                    <Button onClick={props.onContact} color="secondary">
                        Kontaktieren
                    </Button>
                )}
                <Button onClick={props.onDone} color="secondary">
                    Fertig
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default InfoDialog;