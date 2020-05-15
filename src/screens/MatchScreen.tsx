import {Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React, {useEffect, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import MatchList from "../components/List/MatchList";
import kategorie_behelfsmaske from "../resources/kategorie_behelfsmaske.svg";
import kategorie_desinfektion from "../resources/kategorie_desinfektion.svg";
import kategorie_probenentnahme from "../resources/kategorie_probenentnahme.svg";
import kategorie_schutzkleidung from "../resources/kategorie_schutzkleidung.svg";
import kategorie_schutzmaske from "../resources/kategorie_schutzmaske.svg";
import kategorie_sonstiges from "../resources/kategorie_sonstiges.svg";
import {loadArtikelKategorien} from "../state/artikel/ArtikelKategorienState";
import {loadMatches} from "../state/match/MatchesState";
import {loadKonversationen} from "../state/nachricht/KonversationenState";
import {RootState} from "../state/Store";

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
    const history = useHistory();

    useEffect(() => {
        dispatch(loadMatches());
        dispatch(loadArtikelKategorien());
        dispatch(loadKonversationen());
    }, [dispatch]);

    const matches = useSelector((state: RootState) => state.matches.value);
    const kategorien = useSelector((state: RootState) => state.artikelKategorien.value);
    const conversations = useSelector((state: RootState) => state.konversationen.value);

    const entries = useMemo(() => matches?.map(match => ({
        original: match,
        icon: getIcon(kategorien?.find(k => k.id === match.artikel.artikelKategorieId)?.name || ""),
        conversationId: conversations?.find(c => c.referenzId === match.anfrageId)?.id
    })) || [], [matches, kategorien, conversations]);

    return (
        <>
            <div className={classes.container}>
                <Typography className={classes.title}>Ihre Matches</Typography>
                <Typography className={classes.subtitle}>Unten sehen Sie alle Matches, also alle Anfragen, die Sie
                    gestellt oder empfangen haben, die akzeptiert wurden.</Typography>

                <MatchList
                    results={entries}
                    onOpenConversationClicked={item => history.push("/konversation/" + item.conversationId || "")}/>
            </div>
        </>
    );
};

export default MatchScreen;