import {Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useHistory} from "react-router-dom";
import ConversationList from "../components/List/ConversationList";
import {loadKonversationAngebotAnfragen} from "../state/nachricht/KonversationAngebotAnfragenState";
import {loadKonversationBedarfAnfragen} from "../state/nachricht/KonversationBedarfAnfragenState";
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
        marginTop: "12px",
        fontFamily: "Montserrat, sans-serif",
        fontSize: "16px",
        color: "rgba(0, 0, 0, 0.54)",
        flexGrow: 1
    },
    list: {
        marginTop: "16px"
    }
}));

const ConversationListScreen: React.FC = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const conversations = useSelector((state: RootState) => state.konversationen.value) || [];
    const conversationDemandDetails = useSelector((state: RootState) => state.konversationBedarfAnfragen.value);
    const conversationOfferDetails = useSelector((state: RootState) => state.konversationAngebotAnfragen.value);

    useEffect(() => {
        dispatch(loadKonversationen());
        const interval = setInterval(() => dispatch(loadKonversationen()), 15 * 1000);
        return () => clearInterval(interval);
    }, [dispatch]);

    useEffect(() => {
        const angebotAnfrageIdsToLoad = conversations.filter(k => k.referenzTyp === "ANGEBOT_ANFRAGE").map(k => k.referenzId);
        const bedarfAnfrageIdsToLoad = conversations.filter(k => k.referenzTyp === "BEDARF_ANFRAGE").map(k => k.referenzId);
        dispatch(loadKonversationAngebotAnfragen(...angebotAnfrageIdsToLoad));
        dispatch(loadKonversationBedarfAnfragen(...bedarfAnfrageIdsToLoad));
    }, [dispatch, conversations]);

    const onOpenConversationClicked = useCallback((conversationId: string) => {
        history.push("/konversation/" + conversationId);
    }, [history]);

    return (
        <>
            <div className={classes.container}>
                <Typography
                    className={classes.title}>Ihre Konversationen</Typography>
                <Typography className={classes.subtitle}>
                    Unten sehen Sie alle Ihre vorhandenen Konversationen aufgelistet. Eine Konversation wird
                    erstellt, sobald Sie eine Anfrage zu einem Angebot oder Bedarf stellen oder erhalten.
                </Typography>

                <ConversationList
                    className={classes.list}
                    onOpenConversationClicked={onOpenConversationClicked}
                    conversations={conversations}
                    demandDetails={conversationDemandDetails}
                    offerDetails={conversationOfferDetails}/>
            </div>
        </>
    );
};

export default ConversationListScreen;