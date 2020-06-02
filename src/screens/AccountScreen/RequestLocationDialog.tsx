import {makeStyles} from "@material-ui/core/styles";
import React, {useCallback, useState} from "react";
import PopupDialog from "../../components/Dialog/PopupDialog";
import Autocomplete from "../../components/Form/Autocomplete";
import TextInput from "../../components/Form/TextInput";
import countries from "../../resources/countries.json";
import {apiPost} from "../../util/ApiUtils";
import {defined, stringLength, validate} from "../../util/ValidationUtils";

const countriesSorted = Object.entries(countries.DE).sort(([, a], [, b]) => a.localeCompare(b));

interface Props {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;
}

const useStyles = makeStyles(() => ({
    formRow: {
        display: "flex"
    },
    formField: {
        margin: "12px"
    },
    formRowFieldSmall: {
        margin: "12px",
        width: "150px"
    },
    formRowFieldLarge: {
        flexGrow: 1,
        margin: "12px"
    },
    error: {
        margin: "0px 12px 8px 12px"
    }
}));

const RequestLocationDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const {onSaved, onCancelled, open} = props;

    const [name, setName] = useState<string>("");
    const [strasse, setStrasse] = useState<string>("");
    const [hausnummer, setHausnummer] = useState<string>("");
    const [plz, setPlz] = useState<string>("");
    const [ort, setOrt] = useState<string>("");
    const [land, setLand] = useState<[string, string] | null>(null);

    const [disabled, setDisabled] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const onCloseError = useCallback(() => setError(undefined), []);

    const onSave = useCallback(async () => {
        const error = validate(
            stringLength(name, "Der Name", 1),
            stringLength(strasse, "Die Strasse", 1),
            stringLength(hausnummer, "Die Hausnummer", 1),
            stringLength(plz, "Die PLZ", 1),
            stringLength(ort, "Der Ort", 1),
            defined(land, "Kein Land ausgewählt!")
        );

        if (error) {
            setError(error);
            return;
        }

        setError(undefined);
        setDisabled(true);

        const [key] = land!;

        const result = await apiPost(`/remedy/institution/standort`, {
            name,
            strasse,
            hausnummer,
            plz,
            ort,
            land: key
        });

        setDisabled(false);
        if (result.error) {
            setError(result.error);
        } else {
            setName("");
            setStrasse("");
            setHausnummer("");
            setPlz("");
            setOrt("");
            setOrt("");
            setLand(null);
            onSaved();
        }
    }, [onSaved, name, strasse, hausnummer, plz, ort, land]);

    const onCancel = useCallback(() => {
        setError(undefined);
        onCancelled();
    }, [onCancelled]);

    return (
        <PopupDialog
            fullWidth={false}
            open={open}
            error={error}
            title="Standort beantragen"
            subtitle="Bitte füllen Sie das unten angezeigte Formular aus, um einen neuen Standort zu beantragen. Wir prüfen Ihren Antrag dann schnellstmöglich und geben Ihnen Bescheid."
            disabled={disabled}
            errorClassName={classes.error}
            firstTitle="Abbrechen"
            secondTitle="Speichern"
            onFirst={onCancel}
            onSecond={onSave}
            onCloseError={onCloseError}>

            <TextInput
                dense
                label="Name"
                onChange={setName}
                value={name}
                className={classes.formField}
                disabled={disabled}/>

            <div className={classes.formRow}>

                <TextInput
                    dense
                    label="Straße"
                    onChange={setStrasse}
                    value={strasse}
                    className={classes.formRowFieldLarge}
                    disabled={disabled}/>

                <TextInput
                    dense
                    label="Nr."
                    onChange={setHausnummer}
                    value={hausnummer}
                    className={classes.formRowFieldSmall}
                    disabled={disabled}/>

            </div>

            <div className={classes.formRow}>

                <TextInput
                    dense
                    label="PLZ"
                    onChange={setPlz}
                    value={plz}
                    className={classes.formRowFieldSmall}
                    disabled={disabled}/>

                <TextInput
                    dense
                    label="Ort"
                    onChange={setOrt}
                    value={ort}
                    className={classes.formRowFieldLarge}
                    disabled={disabled}/>

            </div>

            <Autocomplete
                dense
                onChange={setLand}
                options={countriesSorted}
                value={land}
                disabled={disabled}
                getOptionLabel={([, value]) => value}
                className={classes.formField}
                label="Land"/>

        </PopupDialog>
    );
};

export default RequestLocationDialog;