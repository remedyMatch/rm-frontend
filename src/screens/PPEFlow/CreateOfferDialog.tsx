import {makeStyles, Theme} from "@material-ui/core/styles";
import React, {useCallback, useState} from "react";
import PopupDialog from "../../components/Dialog/PopupDialog";
import Checkbox from "../../components/Form/Checkbox";
import CheckboxGroup from "../../components/Form/CheckboxGroup";
import DateInput from "../../components/Form/DateInput";
import NumberInput from "../../components/Form/NumberInput";
import TextArea from "../../components/Form/TextArea";
import {Angebot} from "../../domain/angebot/Angebot";
import {InstitutionAngebot} from "../../domain/angebot/InstitutionAngebot";
import {apiPost, logApiError} from "../../util/ApiUtils";
import {defined, numberSize, stringLength, validate} from "../../util/ValidationUtils";

interface Props {
    open: boolean;
    onCreated: (created: InstitutionAngebot) => void;
    onCancelled: () => void;
    variantId?: string;
}

const useStyles = makeStyles((theme: Theme) => ({
    dialogContent: {
        display: "flex",
        flexDirection: "column"
    },
    row: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    rowEntry: {
        minWidth: "260px",
        flexGrow: 1,
        width: "calc((100% - 4.5em) / 2)",
        margin: "0px auto"
    },
    formRow: {
        minWidth: "260px",
        flexGrow: 1,
        margin: "1.5em 0em"
    }
}));

const CreateOfferDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const {onCancelled, onCreated, variantId} = props;

    const [amount, setAmount] = useState<number | undefined>(0);
    const [useBefore, setUseBefore] = useState<Date | undefined>(undefined);
    const [publicOffer, setPublicOffer] = useState<boolean>(true);
    const [sterile, setSterile] = useState<boolean>(false);
    const [sealed, setSealed] = useState<boolean>(false);
    const [medical, setMedical] = useState<boolean>(false);
    const [comment, setComment] = useState<string>("");

    const [disabled, setDisabled] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const onCloseError = useCallback(() => setError(undefined), []);

    const onCreate = useCallback(async () => {
        const error = validate(
            defined(variantId, "Es wurde keine Variante ausgewählt!"),
            defined(amount, "Es wurde keine Anzahl ausgewählt!"),
            numberSize(amount!, "Die angebotene Anzahl", 1),
            stringLength(comment, "Ihre Nachricht", 1, 1024)
        );

        if (error) {
            setError(error);
            return;
        }

        setError(undefined);
        setDisabled(true);

        const result = await apiPost<Angebot>("/remedy/angebot", {
            artikelVarianteId: variantId,
            anzahl: amount,
            kommentar: comment,
            haltbarkeit: useBefore,
            steril: sterile,
            medizinisch: medical,
            originalverpackt: sealed,
            oeffentlich: publicOffer
        });

        setDisabled(false);
        if (result.error) {
            logApiError(result, "Beim Anlegen des Angebots ist ein Fehler aufgetreten");
            setError("Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        } else {
            setAmount(0);
            setUseBefore(undefined);
            setPublicOffer(true);
            setSterile(false);
            setSealed(false);
            setMedical(false);
            setComment("");
            onCreated({anfragen: [], ...result.result!});
        }
    }, [onCreated, variantId, amount, comment, useBefore, sterile, medical, sealed, publicOffer]);

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
                secondTitle="Erstellen"
                onSecond={onCreate}
                title="Inserat erstellen"
                subtitle="Um ein Inserat zu erstellen, benötigen wir noch ein paar weitere Informationen von Ihnen.">

                <div className={classes.dialogContent}>

                    <div className={classes.row}>

                        <NumberInput
                            label="Wie viele besitzen Sie?"
                            disabled={disabled}
                            onChange={setAmount}
                            className={classes.rowEntry}
                            value={amount}/>

                        <DateInput
                            className={classes.rowEntry}
                            disabled={disabled}
                            value={useBefore}
                            disablePast
                            label="Gibt es ein Ablaufdatum?"
                            placeholder="Optional"
                            onChange={setUseBefore}/>

                    </div>

                    <div className={classes.row}>

                        <CheckboxGroup
                            className={classes.rowEntry}
                            label="Wie ist der Zustand?">

                            <Checkbox
                                disabled={disabled}
                                checked={sterile}
                                onChange={setSterile}
                                label="Steril"/>

                            <Checkbox
                                disabled={disabled}
                                checked={sealed}
                                onChange={setSealed}
                                label="Originalverpackt"/>

                            <Checkbox
                                disabled={disabled}
                                checked={medical}
                                onChange={setMedical}
                                label="Medizinisch"/>

                        </CheckboxGroup>

                        <TextArea
                            label="Ihre Nachricht"
                            onChange={setComment}
                            className={classes.rowEntry}
                            disabled={disabled}
                            minLines={4}
                            maxLines={4}
                            placeholder="Bitte eintippen..."
                            value={comment}/>

                    </div>

                    <CheckboxGroup
                        className={classes.formRow}
                        label="Möchten Sie Anfragen zu diesem Angebot erhalten?">

                        <Checkbox
                            disabled={disabled}
                            checked={publicOffer}
                            onChange={setPublicOffer}
                            label="Angebot ist öffentlich"/>

                    </CheckboxGroup>

                </div>

            </PopupDialog>
        </>
    )
};

export default CreateOfferDialog;
