import {Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import ResultList, {ResultListDataRow} from "../components/List/ResultList";
import {Angebot} from "../domain/angebot/Angebot";
import {InstitutionAngebot} from "../domain/angebot/InstitutionAngebot";
import {ArtikelKategorie} from "../domain/artikel/ArtikelKategorie";
import {Bedarf} from "../domain/bedarf/Bedarf";
import {InstitutionBedarf} from "../domain/bedarf/InstitutionBedarf";
import kategorie_behelfsmaske from "../resources/kategorie_behelfsmaske.svg";
import kategorie_desinfektion from "../resources/kategorie_desinfektion.svg";
import kategorie_probenentnahme from "../resources/kategorie_probenentnahme.svg";
import kategorie_schutzkleidung from "../resources/kategorie_schutzkleidung.svg";
import kategorie_schutzmaske from "../resources/kategorie_schutzmaske.svg";
import kategorie_sonstiges from "../resources/kategorie_sonstiges.svg";
import {loadInstitutionAngebote} from "../state/angebot/InstitutionAngeboteState";
import {loadArtikelKategorien} from "../state/artikel/ArtikelKategorienState";
import {loadInstitutionBedarfe} from "../state/bedarf/InstitutionBedarfeState";
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

const AdScreen: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadInstitutionAngebote());
        dispatch(loadInstitutionBedarfe());
        dispatch(loadArtikelKategorien());
    }, [dispatch]);

    const [cancelAdDialogOpen, setCancelAdDialogOpen] = useState(false);
    const [editCountDialogOpen, setEditCountDialogOpen] = useState(false);
    const [editAdDialogOpen, setEditAdDialogOpen] = useState(false);
    const [selectedAdType, setSelectedAdType] = useState<"offer" | "demand" | undefined>(undefined);
    const [selectedAd, setSelectedAd] = useState<Angebot | Bedarf | undefined>(undefined);

    const onEditAdClicked = useCallback((item: ResultListDataRow) => {
        setSelectedAd(item.original);
        setSelectedAdType(item.type);
        setEditAdDialogOpen(true);
    }, []);

    const onEditCountDialogSaved = useCallback(() => {
        dispatch(selectedAdType === "offer" ? loadInstitutionAngebote() : loadInstitutionBedarfe());
        setEditCountDialogOpen(false);
        setSelectedAd(undefined);
        setSelectedAdType(undefined);
    }, [dispatch, selectedAdType]);

    const onEditCountDialogCancelled = useCallback(() => {
        setEditCountDialogOpen(false);
        setSelectedAd(undefined);
        setSelectedAdType(undefined);
    }, []);

    const onCancelAdDialogCancelled = useCallback(() => {
        setCancelAdDialogOpen(false);
        setSelectedAd(undefined);
        setSelectedAdType(undefined);
    }, []);

    const onCancelAdDialogAccepted = useCallback(() => {
        dispatch(selectedAdType === "offer" ? loadInstitutionAngebote() : loadInstitutionBedarfe());
        setCancelAdDialogOpen(false);
        setSelectedAd(undefined);
        setSelectedAdType(undefined);
    }, [dispatch, selectedAdType]);

    const onEditAdDialogEditCountClicked = useCallback(() => {
        setEditAdDialogOpen(false);
        setEditCountDialogOpen(true);
    }, []);

    const onEditAdDialogCancelAdClicked = useCallback(() => {
        setEditAdDialogOpen(false);
        setCancelAdDialogOpen(true);
    }, []);

    const onEditAdDialogCancelClicked = useCallback(() => {
        setEditAdDialogOpen(false);
        setSelectedAd(undefined);
        setSelectedAdType(undefined);
    }, []);

    const angebote = useSelector((state: RootState) => state.institutionAngebote.value);
    const bedarfe = useSelector((state: RootState) => state.institutionBedarfe.value);
    const kategorien = useSelector((state: RootState) => state.artikelKategorien.value);

    const ads = useMemo(
        () => (angebote || [])
            .map(x => mapToAd(x, false, kategorien))
            .concat(bedarfe?.map(x => mapToAd(x, true, kategorien)) || []),
        [angebote, bedarfe, kategorien]
    );

    return (
        <>
            <div className={classes.container}>
                <Typography className={classes.title}>Ihre Inserate</Typography>
                <Typography className={classes.subtitle}>Unten sehen Sie alle Angebote und Bedarfe, die Ihre
                    Institution erstellt hat. Über einen Klick auf "Angebot bearbeiten" bzw. "Bedarf bearbeiten" können
                    Sie die Artikel-Anzahl anpassen oder das Inserat stornieren.</Typography>
                <ResultList
                    showAdType
                    onButtonClicked={onEditAdClicked}
                    results={ads}/>
            </div>

            <EditAdDialog
                open={editAdDialogOpen}
                onEditCountClicked={onEditAdDialogEditCountClicked}
                onCancelAdClicked={onEditAdDialogCancelAdClicked}
                onCancelClicked={onEditAdDialogCancelClicked}/>

            <CancelAdDialog
                open={cancelAdDialogOpen}
                type={selectedAdType}
                adId={selectedAd?.id}
                onCancelled={onCancelAdDialogCancelled}
                onAccepted={onCancelAdDialogAccepted}/>

            <EditCountDialog
                open={editCountDialogOpen}
                onSaved={onEditCountDialogSaved}
                onCancelled={onEditCountDialogCancelled}
                adId={selectedAd?.id}
                type={selectedAdType}
                currentCount={selectedAd?.verfuegbareAnzahl}/>
        </>
    );
};

export default AdScreen;