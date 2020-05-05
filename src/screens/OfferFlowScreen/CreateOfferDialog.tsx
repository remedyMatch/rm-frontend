import {TextareaAutosize} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import React, {useCallback, useState} from "react";
import PopupDialog from "../../components/Dialog/PopupDialog";
import DateInput from "../../components/Form/DateInput";
import NumberInput from "../../components/Form/NumberInput";
import {FormCheckbox} from "../../components/Form/old/FormCheckbox";
import {apiPost} from "../../util/ApiUtils";
import {defined, numberSize, stringLength, validate} from "../../util/ValidationUtils";

interface Props {
    open: boolean;
    onCreated: () => void;
    onCancelled: () => void;
    variantId?: string;
}

interface State {
}

const useStyles = makeStyles((theme: Theme) => ({
    dialogContent: {
        display: "flex",
        flexDirection: "column"
    },
    formRow: {
        marginTop: "16px"
    },
    checkbox: {
        marginRight: "auto"
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

const CreateOfferDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const {onCancelled, onCreated, variantId} = props;

    const [amount, setAmount] = useState<number>(0);
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
            defined(variantId, "Es muss eine Variante gewählt werden!"),
            numberSize(amount, "Die Anzahl", 1),
            stringLength(comment, "Der Kommentar", 1, 1024)
        );

        if (error) {
            setError(error);
            return;
        }

        setError(undefined);
        setDisabled(true);

        const result = await apiPost("/remedy/angebot", {
            artikelVarianteId: props.variantId,
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
            setError(result.error);
        } else {
            setAmount(0);
            setUseBefore(undefined);
            setPublicOffer(true);
            setSterile(false);
            setSealed(false);
            setMedical(false);
            setComment("");
            onCreated();
        }
    }, [onCreated, variantId, amount, comment, useBefore, sterile, medical, sealed]);

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

                    <NumberInput
                        label="Wie viele Artikel besitzen Sie?"
                        disabled={disabled}
                        onChange={setAmount}
                        className={classes.formRow}
                        value={amount}/>

                    <DateInput
                        className={classes.formRow}
                        disabled={disabled}
                        value={useBefore}
                        disablePast
                        label="Wie lange sind die Artikel haltbar?"
                        placeholder="Bitte auswählen oder eintippen"
                        onChange={setUseBefore}/>

                    <FormCheckbox
                        className={classes.checkbox}
                        disabled={disabled}
                        checked={publicOffer}
                        onChange={setPublicOffer}
                        label="Angebot ist öffentlich"
                    />

                    <FormCheckbox
                        className={classes.checkbox}
                        disabled={disabled}
                        checked={sterile}
                        onChange={setSterile}
                        label="Produkt ist steril"
                    />

                    <FormCheckbox
                        className={classes.checkbox}
                        disabled={disabled}
                        checked={sealed}
                        onChange={setSealed}
                        label="Produkt ist originalverpackt"
                    />

                    <FormCheckbox
                        className={classes.checkbox}
                        disabled={disabled}
                        checked={medical}
                        onChange={setMedical}
                        label="Produkt ist medizinisch"
                    />

                    <TextareaAutosize
                        rowsMin={3}
                        rowsMax={8}
                        placeholder="Kommentar"
                        value={comment}
                        disabled={disabled}
                        className={classes.comment}
                        onChange={e => setComment(e.target.value)}/>

                </div>

            </PopupDialog>
        </>
    )
};

export default CreateOfferDialog;
