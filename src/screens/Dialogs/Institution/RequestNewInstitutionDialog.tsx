import {makeStyles} from "@material-ui/core/styles";
import React, {useCallback, useState} from "react";
import PopupDialog from "../../../components/Dialog/PopupDialog";
import FormAutocomplete from "../../../components/Form/FormAutocomplete";
import {FormTextInput} from "../../../components/Form/FormTextInput";
import {InstitutionTyp} from "../../../domain/institution/Institution";
import {InstitutionRolle} from "../../../domain/institution/InstitutionAntrag";
import {apiPost} from "../../../util/ApiUtils";
import {defined, stringLength, validate} from "../../../util/ValidationUtils";

interface Props {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;
}

const useStyles = makeStyles(() => ({
    formRow: {
        marginTop: "8px",
        display: "flex"
    },
    formField: {
        marginTop: "8px"
    },
    formRowFieldSmall: {},
    formRowFieldLarge: {
        flexGrow: 1
    }
}));

const RequestNewInstitutionDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const [name, setName] = useState<string>("");
    const [strasse, setStrasse] = useState<string>("");
    const [hausnummer, setHausnummer] = useState<string>("");
    const [plz, setPlz] = useState<string>("");
    const [ort, setOrt] = useState<string>("");
    const [land, setLand] = useState<string>("");
    const [webseite, setWebseite] = useState<string>("");
    const [rolle, setRolle] = useState<InstitutionRolle | undefined>(undefined);
    const [typ, setTyp] = useState<InstitutionTyp | undefined>(undefined);

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
            stringLength(land, "Das Land", 1),
            stringLength(webseite, "Die Webseite", 1),
            defined(rolle, "Keine Rolle ausgewählt!"),
            defined(typ, "Kein Typ ausgewählt!")
        );

        if (error) {
            setError(error);
            return;
        }

        setError(undefined);
        setDisabled(true);

        const result = await apiPost(`/remedy/institution/beantragen`, {
            name,
            strasse,
            hausnummer,
            plz,
            ort,
            land,
            webseite,
            rolle,
            institutionTyp: typ
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
            setLand("");
            setWebseite("");
            setRolle(undefined);
            setTyp(undefined);
            props.onSaved();
        }
    }, [props.onSaved, name, strasse, hausnummer, plz, ort, land, webseite, rolle, typ]);

    const onCancel = useCallback(() => {
        setError(undefined);
        props.onCancelled();
    }, [props.onCancelled]);

    return (
        <PopupDialog
            fullWidth={false}
            open={props.open}
            error={error}
            title="Institution beantragen"
            disabled={disabled}
            firstTitle="Abbrechen"
            secondTitle="Speichern"
            onFirst={onCancel}
            onSecond={onSave}
            onCloseError={onCloseError}>

            <FormTextInput
                label="Name"
                onChange={setName}
                value={name}
                className={classes.formField}
                disabled={disabled}/>

            <div className={classes.formRow}>

                <FormTextInput
                    label="Straße"
                    onChange={setStrasse}
                    value={strasse}
                    className={classes.formRowFieldLarge}
                    disabled={disabled}/>

                <FormTextInput
                    label="Nr."
                    onChange={setHausnummer}
                    value={hausnummer}
                    className={classes.formRowFieldSmall}
                    disabled={disabled}/>

            </div>

            <div className={classes.formRow}>

                <FormTextInput
                    label="PLZ"
                    onChange={setPlz}
                    value={plz}
                    className={classes.formRowFieldSmall}
                    disabled={disabled}/>

                <FormTextInput
                    label="Ort"
                    onChange={setOrt}
                    value={ort}
                    className={classes.formRowFieldLarge}
                    disabled={disabled}/>

            </div>

            <FormTextInput
                label="Land"
                onChange={setLand}
                value={land}
                className={classes.formField}
                disabled={disabled}/>

            <FormTextInput
                label="Webseite"
                onChange={setWebseite}
                value={webseite}
                className={classes.formField}
                disabled={disabled}/>

            <FormAutocomplete
                onChange={setRolle}
                options={["SPENDER", "EMPFAENGER"] as InstitutionRolle[]}
                value={rolle}
                disabled={disabled}
                getOptionLabel={a => a.substring(0, 1) + a.substring(1).toLowerCase()}
                className={classes.formField}
                label="Rolle"/>

            <FormAutocomplete
                onChange={setTyp}
                options={["ANDERE", "ARZT", "GEWERBE_UND_INDUSTRIE", "KRANKENHAUS", "LIEFERANT", "PFLEGEDIENST", "PRIVAT"] as InstitutionTyp[]}
                value={rolle}
                disabled={disabled}
                getOptionLabel={a => a.split("_").map((x: string) => x.substring(0, 1) + x.substring(1).toLowerCase()).join(" ")}
                className={classes.formField}
                label="Typ"/>

        </PopupDialog>
    );
};

export default RequestNewInstitutionDialog;