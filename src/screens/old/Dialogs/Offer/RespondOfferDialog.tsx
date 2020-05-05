import {TextareaAutosize} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import React, {useCallback, useState} from "react";
import PopupDialog from "../../../../components/Dialog/PopupDialog";
import {FormNumberInput} from "../../../../components/Form/FormNumberInput";
import {Angebot} from "../../../../domain/angebot/Angebot";
import {apiPost} from "../../../../util/ApiUtils";
import {defined, numberSize, stringLength, validate} from "../../../../util/ValidationUtils";

interface Props {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;

    angebot?: Angebot;
}

const useStyles = makeStyles((theme: Theme) => ({
    caption: {
        textAlign: "right",
        marginTop: "8px"
    },
    formRow: {
        marginTop: "16px"
    },
    comment: {
        marginTop: "16px",
        resize: "none",
        fontSize: "14px",
        padding: "16px",
        "&:focus": {
            outline: "none",
            border: "2px solid " + theme.palette.primary.main
        }
    }
}));

const RespondOfferDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const {onCancelled, onSaved, angebot} = props;

    const [comment, setComment] = useState<string>("");
    const [amount, setAmount] = useState<number>(0);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const onCloseError = useCallback(() => setError(undefined), []);

    const onSave = useCallback(async () => {
        const error = validate(
            defined(angebot, "Angebot nicht gesetzt!"),
            numberSize(amount, "Die Anzahl", 1),
            stringLength(comment, "Der Kommentar", 1, 1024)
        );

        if (error) {
            setError(error);
            return;
        }

        setError(undefined);
        setDisabled(true);

        const result = await apiPost(`/remedy/angebot/${angebot!.id}/anfrage`, {
            kommentar: comment,
            anzahl: amount
        });

        setDisabled(false);
        if (result.error) {
            setError(result.error);
        } else {
            setAmount(0);
            setComment("");
            onSaved();
        }
    }, [onSaved, angebot, comment, amount]);

    const onCancel = useCallback(() => {
        setError(undefined);
        onCancelled();
    }, [onCancelled]);

    return (
        <PopupDialog
            width="md"
            open={props.open}
            error={error}
            title="Kontakt aufnehmen"
            disabled={disabled}
            firstTitle="Abbrechen"
            secondTitle="Absenden"
            onFirst={onCancel}
            onSecond={onSave}
            onCloseError={onCloseError}>

            <FormNumberInput
                min={0}
                label="Benötigte Anzahl"
                onChange={setAmount}
                className={classes.formRow}
                disabled={disabled}/>

            <TextareaAutosize
                rowsMin={3}
                rowsMax={8}
                placeholder="Kommentar"
                value={comment}
                disabled={disabled}
                className={classes.comment}
                onChange={e => setComment(e.target.value)}/>

        </PopupDialog>
    );
};

export default RespondOfferDialog;