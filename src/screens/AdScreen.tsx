import {Button, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory, useRouteMatch} from "react-router-dom";
import AdList, {AdListDataRow} from "../components/List/AdList";
import {Angebot} from "../domain/angebot/Angebot";
import {InstitutionAngebot} from "../domain/angebot/InstitutionAngebot";
import {ArtikelKategorie} from "../domain/artikel/ArtikelKategorie";
import {Bedarf} from "../domain/bedarf/Bedarf";
import {InstitutionBedarf} from "../domain/bedarf/InstitutionBedarf";
import {Konversation} from "../domain/nachricht/Konversation";
import kategorie_behelfsmaske from "../resources/kategorie_behelfsmaske.svg";
import kategorie_desinfektion from "../resources/kategorie_desinfektion.svg";
import kategorie_probenentnahme from "../resources/kategorie_probenentnahme.svg";
import kategorie_schutzkleidung from "../resources/kategorie_schutzkleidung.svg";
import kategorie_schutzmaske from "../resources/kategorie_schutzmaske.svg";
import kategorie_sonstiges from "../resources/kategorie_sonstiges.svg";
import {loadInstitutionAngebote} from "../state/angebot/InstitutionAngeboteState";
import {loadArtikelKategorien} from "../state/artikel/ArtikelKategorienState";
import {loadInstitutionBedarfe} from "../state/bedarf/InstitutionBedarfeState";
import {loadKonversationen} from "../state/nachricht/KonversationenState";
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
    subtitleActionContainer: {
        paddingTop: "12px",
        display: "flex",
        flexDirection: "row"
    },
    subtitle: {
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        color: "rgba(0, 0, 0, 0.54)",
        flexGrow: 1
    },
    titleButton: {
        margin: "auto 0px 8px 32px",
        fontFamily: "Montserrat, sans-serif",
        fontWeight: 600,
        fontSize: "16px",
        height: "48px",
        textTransform: "none",
        color: "#007c92",
        border: "2px solid #007c92",
        borderRadius: "8px",
        whiteSpace: "nowrap",
        padding: "8px 24px",
        placeSelf: "flex-end",
        flexShrink: 0
    }
}));

const mapToAd = (
    entry: InstitutionBedarf | InstitutionAngebot,
    bedarf: boolean,
    kategorien: ArtikelKategorie[] | undefined,
    konversationen: Konversation[] | undefined) => {
    return {
        id: entry.id,
        icon: getIcon(kategorien?.find(ak => ak.id === entry.artikel.artikelKategorieId)?.name || ""),
        articleName: entry.artikel.name,
        variantName: entry.artikel.varianten.length > 1 ? entry.artikel.varianten.find(v => v.id === entry.artikelVarianteId)?.variante : undefined,
        categoryId: entry.artikel.artikelKategorieId,
        articleId: entry.artikel.id,
        variantId: entry.artikelVarianteId,
        location: entry.ort,
        amount: entry.verfuegbareAnzahl,
        comment: entry.kommentar,
        sealed: ("originalverpackt" in entry && entry.originalverpackt) || undefined,
        sterile: entry.steril,
        medical: entry.medizinisch,
        useBefore: ("haltbarkeit" in entry && !!entry.haltbarkeit && new Date(entry.haltbarkeit)) || undefined,
        original: entry,
        type: bedarf ? "demand" as const : "offer" as const,
        requests: entry.anfragen.map(request => ({
            id: request.id,
            amount: request.anzahl,
            distance: request.entfernung,
            institution: request.institution.name,
            location: request.standort.ort,
            status: request.status,
            conversationId: konversationen?.find(k => k.referenzId === request.id)?.id
        }))
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
    const history = useHistory();
    const match = useRouteMatch<{ adId?: string }>();

    useEffect(() => {
        dispatch(loadKonversationen());
        dispatch(loadInstitutionAngebote());
        dispatch(loadInstitutionBedarfe());
        dispatch(loadArtikelKategorien());
    }, [dispatch]);

    const [cancelAdDialogOpen, setCancelAdDialogOpen] = useState(false);
    const [editCountDialogOpen, setEditCountDialogOpen] = useState(false);
    const [editAdDialogOpen, setEditAdDialogOpen] = useState(false);
    const [selectedAdType, setSelectedAdType] = useState<"offer" | "demand" | undefined>(undefined);
    const [selectedAd, setSelectedAd] = useState<Angebot | Bedarf | undefined>(undefined);

    const onFindAdClicked = useCallback((item: AdListDataRow) => {
        if (item.type === "demand") {
            history.push(`/bedarf/${item.categoryId}/${item.articleId}/${item.variantId}`);
        } else if (item.type === "offer") {
            history.push(`/angebot/${item.categoryId}/${item.articleId}/${item.variantId}`);
        }
    }, [history]);

    const onEditAdClicked = useCallback((item: AdListDataRow) => {
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

    const onShowAllClicked = useCallback(() => {
        history.push("/inserate");
    }, [history]);

    const angebote = useSelector((state: RootState) => state.institutionAngebote.value);
    const bedarfe = useSelector((state: RootState) => state.institutionBedarfe.value);
    const kategorien = useSelector((state: RootState) => state.artikelKategorien.value);
    const konversationen = useSelector((state: RootState) => state.konversationen.value);

    const ads = useMemo(
        () => (angebote || [])
            .map(x => mapToAd(x, false, kategorien, konversationen))
            .concat(bedarfe?.map(x => mapToAd(x, true, kategorien, konversationen)) || [])
            .filter(x => !match.params.adId || match.params.adId === x.id),
        [konversationen, match, angebote, bedarfe, kategorien]
    );

    return (
        <>
            <div className={classes.container}>
                <Typography
                    className={classes.title}>{match.params.adId ? "Inseratsdetails" : "Ihre Inserate"}</Typography>
                <div className={classes.subtitleActionContainer}>
                    <Typography className={classes.subtitle}>
                        {match.params.adId
                            ? "Unten sehen Sie die Details Ihres Inserats. Klicken Sie auf \"Alle anzeigen\", um "
                            + "stattdessen die Liste aller Ihrer Inserate anzuzeigen."
                            : "Unten sehen Sie alle Angebote und Bedarfe, die Ihre Institution erstellt hat. Über "
                            + "einen Klick auf \"Angebot bearbeiten\" bzw. \"Bedarf bearbeiten\" könnenSie die "
                            + "Artikel-Anzahl anpassen oder das Inserat stornieren."
                        }
                    </Typography>
                    {match.params.adId && (
                        <Button
                            onClick={onShowAllClicked}
                            variant="text"
                            className={classes.titleButton}>
                            Alle anzeigen
                        </Button>
                    )}
                </div>
                <AdList
                    hidePagination={!!match.params.adId}
                    onEditButtonClicked={onEditAdClicked}
                    onFindButtonClicked={onFindAdClicked}
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