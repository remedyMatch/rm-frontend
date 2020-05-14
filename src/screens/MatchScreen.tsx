import {Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import ResultList from "../components/List/ResultList";
import {InstitutionAngebot} from "../domain/angebot/InstitutionAngebot";
import {ArtikelKategorie} from "../domain/artikel/ArtikelKategorie";
import {InstitutionBedarf} from "../domain/bedarf/InstitutionBedarf";
import kategorie_behelfsmaske from "../resources/kategorie_behelfsmaske.svg";
import kategorie_desinfektion from "../resources/kategorie_desinfektion.svg";
import kategorie_probenentnahme from "../resources/kategorie_probenentnahme.svg";
import kategorie_schutzkleidung from "../resources/kategorie_schutzkleidung.svg";
import kategorie_schutzmaske from "../resources/kategorie_schutzmaske.svg";
import kategorie_sonstiges from "../resources/kategorie_sonstiges.svg";
import {loadArtikelKategorien} from "../state/artikel/ArtikelKategorienState";
import {loadMatches} from "../state/match/MatchesState";
import {RootState} from "../state/Store";
import CancelAdDialog from "./AccountScreen/CancelAdDialog";
import EditAdDialog from "./AccountScreen/EditAdDialog";
import EditCountDialog from "./AccountScreen/EditCountDialog";

const useStyles = makeStyles(() => ({
    container: {
        display: "flex",
        flexDirection: "column",
        marginTop: "32px"
    },
    title: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "24px",
        fontWeight: 600,
        lineHeight: 1.33,
        color: "#333"
    },
    subtitle: {
        marginTop: "16px",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        color: "rgba(0, 0, 0, 0.54)",
        flexGrow: 1
    },
}));

const mapToAd = (entry: InstitutionBedarf | InstitutionAngebot, bedarf: boolean, kategorien?: ArtikelKategorie[]) => {
    return {
        id: entry.id,
        icon: getIcon(kategorien?.find(ak => ak.id === entry.artikel.artikelKategorieId)?.name || ""),
        articleName: entry.artikel.name,
        variantName: entry.artikel.varianten.length > 1 ? entry.artikel.varianten.find(v => v.id === entry.artikelVarianteId)?.variante : undefined,
        location: entry.ort,
        distance: entry.entfernung,
        amount: entry.verfuegbareAnzahl,
        comment: entry.kommentar,
        sealed: ("originalverpackt" in entry && entry.originalverpackt) || undefined,
        sterile: entry.steril,
        medical: entry.medizinisch,
        useBefore: ("haltbarkeit" in entry && !!entry.haltbarkeit && new Date(entry.haltbarkeit)) || undefined,
        original: entry,
        buttonText: bedarf ? "Bedarf bearbeiten" : "Angebot bearbeiten",
        type: bedarf ? "demand" as const : "offer" as const
    };
};

const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
        case "desinfektion": {
            return kategorie_desinfektion;
        }
        case "hygiene": {
            return kategorie_sonstiges;
        }
        case "schutzmasken": {
            return kategorie_schutzmaske;
        }
        case "schutzkleidung": {
            return kategorie_schutzkleidung;
        }
        case "probenentnahme": {
            return kategorie_probenentnahme;
        }
        case "behelfs-maske": {
            return kategorie_behelfsmaske;
        }
        default: {
            return kategorie_sonstiges;
        }
    }
};

const MatchScreen: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadMatches());
        dispatch(loadArtikelKategorien());
    }, [dispatch]);

    const matches = useSelector((state: RootState) => state.matches.value);
    const kategorien = useSelector((state: RootState) => state.artikelKategorien.value);

    return (
        <>
            <div className={classes.container}>
                <Typography className={classes.title}>Ihre Matches</Typography>
                <Typography className={classes.subtitle}>Unten sehen Sie alle Matches, also alle Anfragen, die Sie
                    gestellt oder empfangen haben, die akzeptiert wurden.</Typography>

                {matches?.map(match => (
                    <span>{match}</span>
                ))}

            </div>
        </>
    );
};

export default MatchScreen;