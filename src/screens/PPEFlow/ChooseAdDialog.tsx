import {Typography} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import clsx from "clsx";
import React, {useState} from "react";
import PopupDialog from "../../components/Dialog/PopupDialog";
import {InstitutionAngebot} from "../../domain/angebot/InstitutionAngebot";
import {InstitutionBedarf} from "../../domain/bedarf/InstitutionBedarf";
import distance from "../../resources/distance.svg";

interface Props {
    categoryIcon: string;
    open: boolean;
    onChosen: (adId: InstitutionAngebot | InstitutionBedarf) => void;
    onCreateClicked: () => void;
    onCancelled: () => void;
    variantId?: string;
    institutionEntries: (InstitutionAngebot | InstitutionBedarf)[];
    flowType: "demand" | "offer";
}

const useStyles = makeStyles((theme: Theme) => ({
    subtitle: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        color: "#333",
        textAlign: "center",
        lineHeight: 1.2,
        marginTop: "-12px",
        padding: "0px 24px 12px 24px"
    },
    entries: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        margin: "2em 0em",
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
        margin: "0em 0.5em 1em 0.5em",
        width: "calc((100% - 2em) / 2)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        border: "2px solid #CCC",
        borderRadius: "8px",
        padding: "1em",
        transition: theme.transitions.create(["border", "background-color"])
    },
    entrySelected: {
        backgroundColor: "rgba(0, 0, 0, 0.07)",
        border: "2px solid #53284f"
    },
    categoryIcon: {
        height: "4em",
        color: "#333"
    },
    articleName: {
        textAlign: "center",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        color: "#666",
        marginTop: "8px"
    },
    variantName: {
        textAlign: "center",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        fontWeight: 600,
        color: "#666"
    },
    location: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "14px",
        fontWeight: 600,
        marginTop: "16px",
        textAlign: "center",
        color: "#666"
    },
    locationIcon: {
        height: "15px",
        width: "15px",
        color: "#666",
        marginRight: "4px"
    },
    amountCount: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "12px",
        backgroundColor: "#007c92",
        fontWeight: 600,
        borderRadius: "12px",
        padding: "0px 4px",
        color: "white",
        margin: "8px auto 0px auto"
    },
    attributes: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "14px",
        textAlign: "center"
    }
}));

const ChooseAdDialog: React.FC<Props> = props => {
    const classes = useStyles();

    const [selectedEntry, setSelectedEntry] = useState<InstitutionAngebot | InstitutionBedarf | undefined>(undefined);

    const matchingEntries = props.institutionEntries.filter(entry => entry.artikelVarianteId === props.variantId);
    if (matchingEntries.length === 0) {
        return (
            <PopupDialog
                open={props.open}
                firstTitle="Abbrechen"
                onFirst={props.onCancelled}
                secondTitle={props.flowType === "offer" ? "Angebot erstellen" : "Bedarf erstellen"}
                onSecond={props.onCreateClicked}
                title="Inserat erstellen">

                <Typography className={classes.subtitle}>
                    {props.flowType === "offer"
                        ? "Um einen Empfänger zu kontaktieren, müssen Sie zuerst ein passendes Angebot anlegen. Klicken Sie auf 'Angebot erstellen', um dies jetzt zu tun."
                        : "Um einen Spender zu kontaktieren, müssen Sie zuerst einen passenden Bedarf anlegen. Klicken Sie auf 'Bedarf erstellen', um dies jetzt zu tun."}
                </Typography>

            </PopupDialog>
        );
    }

    return (
        <>
            <PopupDialog
                open={props.open}
                firstTitle="Abbrechen"
                onFirst={props.onCancelled}
                secondTitle={props.flowType === "offer" ? "Angebot auswählen" : "Bedarf auswählen"}
                onSecond={() => props.onChosen(selectedEntry!)}
                secondDisabled={!selectedEntry}
                title="Inserat auswählen">

                <Typography className={classes.subtitle}>
                    {props.flowType === "offer"
                        ? "Um einen Empfänger zu kontaktieren, müssen Sie zuerst ein passendes Angebot auswählen. Wählen Sie das korrekte Angebot und klicken Sie auf 'Angebot auswählen'."
                        : "Um einen Spender zu kontaktieren, müssen Sie zuerst einen passenden Bedarf auswählen. Wählen Sie den korrekten Bedarf und klicken Sie auf 'Bedarf auswählen'."}
                </Typography>

                <div className={classes.entries}>
                    {matchingEntries.map(entry => (
                        <div
                            onClick={() => setSelectedEntry(entry)}
                            className={clsx(classes.entry, entry === selectedEntry && classes.entrySelected)}>
                            <img src={props.categoryIcon} alt="Kategorie" className={classes.categoryIcon}/>
                            <span className={classes.amountCount}>{entry.verfuegbareAnzahl}x</span>
                            <span className={classes.articleName}>
                                {entry.artikel.name}
                            </span>
                            {entry.artikel.varianten.length > 1 && (
                                <span className={classes.variantName}>
                                    Gr. {entry.artikel.varianten.find(variante => variante.id === props.variantId)?.variante}
                                </span>
                            )}
                            <span className={classes.location}>
                                <img src={distance} alt="Entfernung" className={classes.locationIcon}/>
                                {entry.ort}
                            </span>
                            {(entry.medizinisch || entry.steril) && (
                                <span className={classes.attributes}>
                                    {[entry.medizinisch && "Medizinisch", entry.steril && "Steril"].filter(e => !!e).join(", ")}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

            </PopupDialog>
        </>
    )
};

export default ChooseAdDialog;
