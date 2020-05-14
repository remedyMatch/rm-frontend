import {makeStyles, Theme} from "@material-ui/core/styles";
import React, {useCallback, useState} from "react";
import PopupDialog from "../../components/Dialog/PopupDialog";
import NumberInput from "../../components/Form/NumberInput";
import TextArea from "../../components/Form/TextArea";
import {Angebot} from "../../domain/angebot/Angebot";
import {InstitutionAngebot} from "../../domain/angebot/InstitutionAngebot";
import {Bedarf} from "../../domain/bedarf/Bedarf";
import {InstitutionBedarf} from "../../domain/bedarf/InstitutionBedarf";
import {apiPost, logApiError} from "../../util/ApiUtils";
import {defined, numberSize, stringLength, validate} from "../../util/ValidationUtils";

interface Props {
    open: boolean;
    onContacted: () => void;
    onCancelled: () => void;
    selectedAd?: InstitutionAngebot | InstitutionBedarf;
    selectedEntry?: Angebot | Bedarf;
    type: "offer" | "demand";
}

const useStyles = makeStyles((theme: Theme) => ({
    dialogContent: {
        display: "flex",
        flexDirection: "column"
    },
    formRow: {
        margin: "1.5em 0em"
    }
}));

const ContactEntryDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const {onCancelled, onContacted, selectedAd, selectedEntry, type} = props;

    const [amount, setAmount] = useState<number | undefined>(0);
    const [comment, setComment] = useState<string>("");

    const [disabled, setDisabled] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const onCloseError = useCallback(() => setError(undefined), []);

    const onContact = useCallback(async () => {
        const error = validate(
            defined(selectedAd, "Es wurde kein " + (type === "offer" ? "passendes Angebot" : "passender Bedarf") + " ausgewählt!"),
            defined(selectedEntry, "Es wurde kein Inserat ausgewählt!"),
            defined(amount, "Es wurde keine Anzahl ausgewählt!"),
            numberSize(amount!, "Die " + (type === "offer" ? "angebotene" : "angefragte") + " Anzahl", 1, Math.min(selectedAd!.verfuegbareAnzahl, selectedEntry!.verfuegbareAnzahl)),
            stringLength(comment, "Ihre Nachricht", 1, 1024)
        );

        if (error) {
            setError(error);
            return;
        }

        setError(undefined);
        setDisabled(true);

        let result;
        if (type === "offer") {
            result = await apiPost("/remedy/bedarf/" + selectedEntry!.id + "/anfrage", {
                anzahl: amount,
                nachricht: comment,
                angebotId: selectedAd!.id
            });
        } else {
            result = await apiPost("/remedy/angebot/" + selectedEntry!.id + "/anfrage", {
                anzahl: amount,
                nachricht: comment,
                bedarfId: selectedAd!.id
            });
        }

        setDisabled(false);
        if (result.error) {
            logApiError(result, "Beim Absenden der Anfrage ist ein Fehler aufgetreten");
            setError("Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        } else {
            setAmount(0);
            setComment("");
            onContacted();
        }
    }, [onContacted, amount, comment, selectedAd, selectedEntry, type]);

    const onCancel = useCallback(() => {
        setError(undefined);
        onCancelled();
    }, [onCancelled]);

    return (
        <>
            <PopupDialog
                open={props.open}
                error={error}
                onCloseError={onCloseError}
                firstTitle="Abbrechen"
                onFirst={onCancel}
                secondTitle="Anfrage absenden"
                onSecond={onContact}
                title="Inserat anfragen"
                subtitle={"Bitte geben Sie die Anzahl, die Sie " + (type === "offer" ? "anbieten" : "anfragen") + " wollen, sowie Ihre Nachricht unten ein und klicken Sie auf 'Anfrage absenden'."}>

                <div className={classes.dialogContent}>

                    <NumberInput
                        className={classes.formRow}
                        label={type === "offer" ? "Wie viele wollen Sie anbieten?" : "Wie viele wollen Sie anfragen?"}
                        disabled={disabled}
                        onChange={setAmount}
                        value={amount}/>

                    <TextArea
                        label="Ihre Nachricht"
                        onChange={setComment}
                        className={classes.formRow}
                        disabled={disabled}
                        minLines={4}
                        maxLines={4}
                        placeholder="Bitte eintippen..."
                        value={comment}/>

                </div>

            </PopupDialog>
        </>
    )
};

export default ContactEntryDialog;
