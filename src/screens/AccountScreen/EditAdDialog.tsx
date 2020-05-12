import {Button, Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React from "react";
import PopupDialog from "../../components/Dialog/PopupDialog";

interface Props {
    open: boolean;
    onEditCountClicked: () => void;
    onCancelAdClicked: () => void;
    onCancelClicked: () => void;
}

const useStyles = makeStyles((theme: Theme) => ({
    buttonContainer: {
        display: "flex",
        justifyContent: "center"
    },
    button: {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        textTransform: "none",
        padding: "8px 24px",
        transition: theme.transitions.create(["border", "color", "background-color"]),
        height: "48px",
        minWidth: "144px",
        backgroundColor: "#007C92",
        margin: "0.5em",
        color: "white",
        whiteSpace: "nowrap",
        "&:hover": {
            backgroundColor: "#006374"
        }
    }
}));

const EditAdDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const {open, onEditCountClicked, onCancelAdClicked, onCancelClicked} = props;

    return (
        <PopupDialog
            fullWidth={false}
            open={open}
            title="Inserat bearbeiten"
            subtitle="Sie können die Anzahl des Insersats verändern oder es komplett stornieren. Dabei werden auch sämtliche offenen Anfragen abgebrochen.">

            <div className={classes.buttonContainer}>

                <Button
                    onClick={onCancelClicked}
                    disableElevation
                    className={classes.button}
                    variant="contained">
                    Abbrechen
                </Button>

                <Button
                    onClick={onCancelAdClicked}
                    disableElevation
                    className={classes.button}
                    variant="contained">
                    Inserat stornieren
                </Button>

                <Button
                    onClick={onEditCountClicked}
                    disableElevation
                    className={classes.button}
                    variant="contained">
                    Anzahl verändern
                </Button>

            </div>

        </PopupDialog>
    );
};

export default EditAdDialog;