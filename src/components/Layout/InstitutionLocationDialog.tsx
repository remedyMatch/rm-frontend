import {Theme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {LocationCity, LocationOn} from "@material-ui/icons";
import clsx from "clsx";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {Institution} from "../../domain/institution/Institution";
import {InstitutionStandort} from "../../domain/institution/InstitutionStandort";
import {Person} from "../../domain/person/Person";
import {apiPut, logApiError} from "../../util/ApiUtils";
import {defined, validate} from "../../util/ValidationUtils";
import PopupDialog from "../Dialog/PopupDialog";

interface Props {
    open: boolean;
    onCancelled: () => void;
    onSaved: () => void;
    person?: Person;
}

const useStyles = makeStyles((theme: Theme) => ({
    root: {
        display: "flex",
        flexDirection: "column"
    },
    divider: {
        border: "none",
        borderTop: "2px solid #CCC",
        width: "100%"
    },
    entries: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        margin: "0.5em -0.5em",
        maxHeight: "300px",
        overflowY: "auto",
        "&::-webkit-scrollbar": {
            width: "12px"
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "rgba(0,0,0,0.1)"
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "darkgrey",
            borderRadius: "6px"
        }
    },
    entry: {
        margin: "0.5em 0.5em 0.5em 0.5em",
        width: "calc((100% - 2em) / 2)",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        border: "2px solid #CCC",
        borderRadius: "8px",
        padding: "1em",
        transition: theme.transitions.create(["border", "background-color"])
    },
    entrySelected: {
        backgroundColor: "rgba(0, 0, 0, 0.07)",
        border: "2px solid #53284f"
    },
    entryTextBlock: {
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        justifyContent: "center"
    },
    institutionName: {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.87)",
        textAlign: "center",
        fontSize: "16px"
    },
    locationName: {
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        color: "rgba(0, 0, 0, 0.87)",
        textAlign: "center",
        fontSize: "16px"
    },
    locationStreet: {
        fontFamily: "Montserrat, sans-serif",
        color: "rgba(0, 0, 0, 0.87)",
        textAlign: "center",
        fontSize: "14px"
    },
    locationCity: {
        fontFamily: "Montserrat, sans-serif",
        color: "rgba(0, 0, 0, 0.87)",
        textAlign: "center",
        fontSize: "14px"
    }
}));

const InstitutionLocationDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const {onCancelled, onSaved, person} = props;

    const [selectedInstitution, setSelectedInstitution] = useState<Institution | undefined>(person?.aktuellerStandort.institution);
    const [selectedLocation, setSelectedLocation] = useState<InstitutionStandort | undefined>(person?.aktuellerStandort.standort);

    const [disabled, setDisabled] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const onCloseError = useCallback(() => setError(undefined), []);

    useEffect(() => {
        if (person) {
            setSelectedInstitution(person.aktuellerStandort.institution);
            setSelectedLocation(person.aktuellerStandort.standort);
        }
    }, [person]);

    const onSelect = useCallback(async () => {
        const error = validate(
            defined(selectedInstitution, "Keine Institution ausgewählt!"),
            defined(selectedLocation, "Kein Standort ausgewählt!")
        );

        if (error) {
            setError(error);
            return;
        }

        setError(undefined);
        setDisabled(true);

        const result = await apiPut("/remedy/person", {
            aktuellesStandortId: selectedLocation!.id
        });

        setDisabled(false);
        if (result.error) {
            logApiError(result, "Beim Auswählen der Institution und des Standorts ist ein Fehler aufgetreten");
            setError("Es ist ein technischer Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        } else {
            onSaved();
        }
    }, [onSaved, selectedLocation, selectedInstitution]);

    const onCancel = useCallback(() => {
        setError(undefined);
        onCancelled();
    }, [onCancelled]);

    // Filter institutions
    const institutions = useMemo(
        () => person?.standorte
            .map(s => s.institution)
            .filter((s, i, a) => a.find(x => x.id === s.id) === s)
            .map(institution => ({
                institution: institution,
                locations: person?.standorte
                    .filter(s => s.institution === institution)
                    .map(s => s.standort)
            })),
        [person]);

    return (
        <PopupDialog
            open={props.open}
            error={error}
            onCloseError={onCloseError}
            disabled={disabled}
            firstTitle="Abbrechen"
            onFirst={onCancel}
            secondTitle="Auswahl speichern"
            onSecond={onSelect}
            title="Institution & Standort wählen"
            subtitle="Wählen Sie die Institution, für die Sie aktuell agieren, und wählen Sie den korrekten Standort. Dieser wird bspw. als Artikelstandort bei neuen Inseraten verwendet.">

            <div className={classes.root}>

                <div className={classes.entries}>
                    {institutions?.map(entry => (
                        <div
                            onClick={disabled ? undefined : () => setSelectedInstitution(entry.institution)}
                            className={clsx(classes.entry, entry.institution.id === selectedInstitution?.id && classes.entrySelected)}>
                            <LocationCity fontSize="large"/>
                            <div className={classes.entryTextBlock}>
                                <span className={classes.institutionName}>{entry.institution.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <hr className={classes.divider}/>

                <div className={classes.entries}>
                    {selectedInstitution?.standorte.map(entry => (
                        <div
                            onClick={disabled ? undefined : () => setSelectedLocation(entry)}
                            className={clsx(classes.entry, entry.id === selectedLocation?.id && classes.entrySelected)}>
                            <LocationOn fontSize="large"/>
                            <div className={classes.entryTextBlock}>
                                <span className={classes.locationName}>{entry.name}</span>
                                <span className={classes.locationStreet}>{entry.strasse} {entry.hausnummer}</span>
                                <span className={classes.locationCity}>{entry.plz} {entry.ort}</span>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

        </PopupDialog>
    );
};

export default InstitutionLocationDialog;